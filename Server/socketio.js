const { Server } = require("socket.io");
const mongoose = require("mongoose");
const { clientOrigins } = require("./config/env");
const { userIdFromHandshake } = require("./middleware/auth");
const CommunityMessage = require("./Schemas/Message");
const PersonalMessage = require("./Schemas/PersonalMessage");
const Community = require("./Schemas/Community");
const Profile = require("./Schemas/Profile");

const MAX_TEXT = 2000;
const RATE_LIMIT = { max: 10, windowMs: 10_000 }; // messages per socket

const userRoom = (id) => `user:${id}`;
const communityRoom = (id) => `community:${id}`;
const personalRoomId = (a, b) => [String(a), String(b)].sort().join("_");
const isId = (value) => typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

// Validates and normalises message text. Returns { text } or { error }.
function cleanText(value) {
  if (typeof value !== "string") return { error: "Message must be text" };
  const text = value.trim();
  if (!text) return { error: "Message is empty" };
  if (text.length > MAX_TEXT) return { error: `Message is too long (max ${MAX_TEXT} characters)` };
  return { text };
}

function createRateLimiter() {
  let stamps = [];
  return () => {
    const now = Date.now();
    stamps = stamps.filter((t) => now - t < RATE_LIMIT.windowMs);
    if (stamps.length >= RATE_LIMIT.max) return false;
    stamps.push(now);
    return true;
  };
}

/**
 * Real-time chat.
 *
 * Every socket is authenticated from the login cookie and bound to one profile, so clients can
 * never send as somebody else. On connect it joins:
 *   user:<id>        personal messages are delivered here, for both people in the chat
 *   community:<id>   one room per community the user is a member of
 *
 * Client -> server (all take an optional ack callback receiving { ok, message?, error? }):
 *   personalMessage  { receiverId, text }
 *   communityMessage { communityId, text }      (members only)
 *   joinCommunity / leaveCommunity <communityId>
 * Server -> client:
 *   personalMessage  { _id, senderId, receiverId, text, timestamp }
 *   communityMessage { _id, communityId, senderId, name, message, date, profile_picture }
 *   communityDeleted { communityId }
 */
const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: clientOrigins, credentials: true, methods: ["GET", "POST"] },
  });

  io.use(async (socket, next) => {
    try {
      const userId = userIdFromHandshake(socket.handshake);
      const profile = userId && (await Profile.findById(userId).select("communities").lean());
      if (!profile) return next(new Error("unauthorized"));
      socket.data.userId = String(profile._id);
      socket.data.communityIds = (profile.communities || []).map(String);
      return next();
    } catch (error) {
      return next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { userId } = socket.data;
    const allowed = createRateLimiter();

    socket.join(userRoom(userId));
    socket.data.communityIds.forEach((id) => socket.join(communityRoom(id)));

    // Wraps a handler: ack-safe, never throws into Socket.IO.
    const on = (event, handler) =>
      socket.on(event, async (payload, ack) => {
        const reply = typeof ack === "function" ? ack : () => {};
        try {
          reply(await handler(payload));
        } catch (error) {
          console.error(`[socket] ${event} failed:`, error.message);
          reply({ ok: false, error: "Something went wrong. Please try again." });
        }
      });

    on("personalMessage", async (payload) => {
      if (!allowed()) return { ok: false, error: "You're sending messages too fast" };
      const { receiverId } = payload || {};
      const { text, error } = cleanText(payload?.text);
      if (error) return { ok: false, error };
      if (!isId(receiverId) || receiverId === userId) return { ok: false, error: "Invalid recipient" };
      if (!(await Profile.exists({ _id: receiverId }))) return { ok: false, error: "User not found" };

      const message = {
        _id: new mongoose.Types.ObjectId(),
        senderId: userId,
        receiverId,
        text,
        timestamp: new Date(),
      };
      await PersonalMessage.updateOne(
        { room: personalRoomId(userId, receiverId) },
        { $push: { messages: message } },
        { upsert: true }
      );
      io.to(userRoom(userId)).to(userRoom(receiverId)).emit("personalMessage", message);
      return { ok: true, message };
    });

    on("communityMessage", async (payload) => {
      if (!allowed()) return { ok: false, error: "You're sending messages too fast" };
      const { communityId } = payload || {};
      const { text, error } = cleanText(payload?.text);
      if (error) return { ok: false, error };
      if (!isId(communityId)) return { ok: false, error: "Invalid community" };

      const [isMember, profile] = await Promise.all([
        Community.exists({ _id: communityId, members: userId }),
        Profile.findById(userId).select("name profilePic").lean(),
      ]);
      if (!isMember || !profile) return { ok: false, error: "Join this community to send messages" };

      // Identity comes from the account, never from the client.
      const message = {
        _id: new mongoose.Types.ObjectId(),
        communityId,
        senderId: userId,
        name: profile.name,
        message: text,
        date: new Date(),
        profile_picture: profile.profilePic,
      };
      const { communityId: _omit, ...stored } = message;
      await CommunityMessage.updateOne({ communityId }, { $push: { messages: stored } }, { upsert: true });
      io.to(communityRoom(communityId)).emit("communityMessage", message);
      return { ok: true, message };
    });

    on("joinCommunity", async (communityId) => {
      if (!isId(communityId)) return { ok: false, error: "Invalid community" };
      if (!(await Community.exists({ _id: communityId, members: userId }))) {
        return { ok: false, error: "Not a member" };
      }
      socket.join(communityRoom(communityId));
      return { ok: true };
    });

    on("leaveCommunity", async (communityId) => {
      if (isId(communityId)) socket.leave(communityRoom(communityId));
      return { ok: true };
    });
  });

  return io;
};

setupSocket.communityRoom = communityRoom;
setupSocket.userRoom = userRoom;

module.exports = setupSocket;

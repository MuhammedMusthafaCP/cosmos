const express = require("express");
const router = express.Router();
const communitymodel = require("../Schemas/Community");
const app = express();
app.use(express.json());
const multer = require("multer");
const profile = require("../Schemas/Profile");
const Message = require("../Schemas/Message");
const { requireAuth } = require("../middleware/auth");
const setupSocket = require("../socketio");

router.use(requireAuth);

const isId = (value) => typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

// Shape sent to the client for list rows: no member list, just the count.
const toListItem = (community, userId, lastMessage) => ({
  _id: community._id,
  name: community.name,
  description: community.description,
  communityprofile: community.communityprofile,
  creator: community.creator,
  memberCount: (community.members || []).length,
  isMember: (community.members || []).some((m) => String(m) === userId),
  lastMessage: lastMessage || null,
});

// Latest message of each community, by id, in one query.
async function lastMessagesFor(ids) {
  const rows = await Message.aggregate([
    { $match: { communityId: { $in: ids } } },
    { $project: { communityId: 1, last: { $arrayElemAt: ["$messages", -1] } } },
  ]);
  return new Map(
    rows
      .filter((row) => row.last)
      .map((row) => [
        String(row.communityId),
        { name: row.last.name, message: row.last.message, date: row.last.date },
      ])
  );
}

// GET ROUTES
// Communities the user has NOT joined, biggest first (discover tab).
router.get("/getAll/:id", async (req, res) => {
  try {
    const communities = await communitymodel
      .find({ members: { $nin: [req.userId] } })
      .select("name description communityprofile creator members")
      .lean();
    const items = communities
      .map((c) => toListItem(c, req.userId))
      .sort((a, b) => b.memberCount - a.memberCount || String(a.name).localeCompare(String(b.name)));
    res.status(200).json(items);
  } catch (error) {
    console.error("An error occurred while fetching community data:", error);
    res.status(500).json({ error: "Internal Server Error while fetching community data" });
  }
});

// Communities the user belongs to, most recently active first.
router.get("/mycommunities/:id", async (req, res) => {
  try {
    const communities = await communitymodel
      .find({ members: req.userId })
      .select("name description communityprofile creator members")
      .lean();
    const last = await lastMessagesFor(communities.map((c) => c._id));
    const items = communities
      .map((c) => toListItem(c, req.userId, last.get(String(c._id))))
      .sort(
        (a, b) =>
          new Date(b.lastMessage?.date || 0) - new Date(a.lastMessage?.date || 0) ||
          String(a.name).localeCompare(String(b.name))
      );
    res.status(200).json(items);
  } catch (error) {
    console.error("An error occurred while fetching community data:", error);
    res.status(500).json({ error: "Internal Server Error while fetching community data" });
  }
});

//* Details of a community: description, member count and one page of members.
router.get("/details/:id", async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Invalid community" });
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const perPage = 10;

    const [community, counts] = await Promise.all([
      communitymodel.findById(req.params.id).populate({
        path: "members",
        select: "name bio profilePic",
        options: { limit: perPage, skip: (page - 1) * perPage },
      }),
      communitymodel.findById(req.params.id).select("members").lean(),
    ]);
    if (!community) return res.status(404).json({ error: "Community not found" });

    res.status(200).json({
      ...community.toObject(),
      memberCount: counts.members.length,
      page,
      hasMoreMembers: page * perPage < counts.members.length,
    });
  } catch (error) {
    console.error("An error occurred while fetching community data:", error);
    res.status(500).json({ error: "Internal Server Error while fetching community data" });
  }
});

// to get a particular community using id
router.get("/:id", async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Invalid community" });
    const community = await communitymodel.findById(req.params.id);
    if (!community) return res.status(404).json({ error: "Community not found" });
    res.status(200).json(community);
  } catch (error) {
    console.error("An error occurred while fetching community data:", error);
    res.status(500).json({ error: "Internal Server Error while fetching community data" });
  }
});

// POST ROUTES. The acting user always comes from the login cookie, never from the request body.
router.post("/create", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();
    const { communityprofile } = req.body;
    if (name.length < 2 || name.length > 60) {
      return res.status(400).json({ error: "Name must be 2 to 60 characters" });
    }
    if (!description || description.length > 300) {
      return res.status(400).json({ error: "Description is required (300 characters max)" });
    }
    if (communityprofile && !/^https?:\/\//.test(communityprofile)) {
      return res.status(400).json({ error: "Invalid picture" });
    }

    const creator = req.userId;
    const com = await communitymodel.create({
      name,
      description,
      communityprofile,
      creator,
      members: [creator],
    });

    await profile.updateOne({ _id: creator }, { $addToSet: { communities: com._id } });
    await Message.create({ messages: [], communityId: com._id });

    // Put the creator's open sockets into the new community's room.
    req.app.get("io")?.in(setupSocket.userRoom(creator)).socketsJoin(setupSocket.communityRoom(com._id));

    res.status(200).json({
      message: "Community created successfully",
      community: toListItem(com.toObject(), creator),
    });
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/join", async (req, res) => {
  const { communityid } = req.body;
  try {
    if (!isId(communityid)) return res.status(400).json({ message: "Invalid community" });
    const result = await communitymodel.updateOne(
      { _id: communityid },
      { $addToSet: { members: req.userId } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: "Community not found" });

    await profile.updateOne({ _id: req.userId }, { $addToSet: { communities: communityid } });
    req.app.get("io")?.in(setupSocket.userRoom(req.userId)).socketsJoin(setupSocket.communityRoom(communityid));

    res.status(200).json({ message: "User joined community successfully" });
  } catch (error) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// *to exit from a community (the creator must delete it instead)
router.post("/exit", async (req, res) => {
  const { communityId } = req.body;
  try {
    if (!isId(communityId)) return res.status(400).json({ message: "Invalid community" });
    const community = await communitymodel.findById(communityId).select("creator members");
    if (!community) return res.status(404).json({ message: "Community not found" });
    if (String(community.creator) === req.userId) {
      return res.status(400).json({ message: "Creators can't leave their community. Delete it instead." });
    }
    if (!community.members.some((m) => String(m) === req.userId)) {
      return res.status(400).json({ message: "User is not a member of the community" });
    }

    await communitymodel.updateOne({ _id: communityId }, { $pull: { members: req.userId } });
    await profile.updateOne({ _id: req.userId }, { $pull: { communities: communityId } });
    req.app.get("io")?.in(setupSocket.userRoom(req.userId)).socketsLeave(setupSocket.communityRoom(communityId));

    res.status(200).json({ message: "Successfully exited the community" });
  } catch (error) {
    console.error("Error while exiting the community", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE: only the creator can remove a community.
router.delete("/delete/:id", async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid community" });
    const community = await communitymodel.findById(req.params.id).select("creator members");
    if (!community) return res.status(404).json({ message: "Community not found" });
    if (String(community.creator) !== req.userId) {
      return res.status(403).json({ message: "Only the creator can delete this community" });
    }

    await communitymodel.deleteOne({ _id: community._id });
    await Message.deleteMany({ communityId: community._id });
    await profile.updateMany({ _id: { $in: community.members } }, { $pull: { communities: community._id } });

    const io = req.app.get("io");
    const room = setupSocket.communityRoom(community._id);
    io?.to(room).emit("communityDeleted", { communityId: String(community._id) });
    io?.in(room).socketsLeave(room);

    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    console.error("Error deleting community and messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

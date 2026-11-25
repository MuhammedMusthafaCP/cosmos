const express = require("express");
const mongoose = require("mongoose");
const Message = require("../Schemas/Message");
const PersonalMessage = require("../Schemas/PersonalMessage");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

router.use(requireAuth);

const isId = (value) => /^[a-f\d]{24}$/i.test(value || "");

// Newest `limit` messages older than `before`, returned oldest-first, without loading the
// whole conversation. `hasMore` tells the client whether to offer "Load earlier messages".
async function readPage(Model, match, field, req) {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 100);
  const before = req.query.before ? new Date(req.query.before) : null;
  if (before && Number.isNaN(before.getTime())) return { error: "Invalid 'before' date" };

  const [doc] = await Model.aggregate([
    { $match: match },
    {
      $project: {
        messages: {
          $slice: [
            {
              $filter: {
                input: "$messages",
                as: "m",
                cond: before ? { $lt: [`$$m.${field}`, before] } : true,
              },
            },
            -(limit + 1),
          ],
        },
      },
    },
  ]);
  const found = doc?.messages || [];
  return { messages: found.slice(-limit), hasMore: found.length > limit };
}

// Messages of a community. Anyone logged in can read (to preview before joining);
// sending requires membership and happens over the socket.
router.get("/:communityId", async (req, res) => {
  try {
    if (!isId(req.params.communityId)) return res.status(400).json({ message: "Invalid community" });
    const result = await readPage(
      Message,
      { communityId: new mongoose.Types.ObjectId(req.params.communityId) },
      "date",
      req
    );
    if (result.error) return res.status(400).json({ message: result.error });
    res.json(result);
  } catch (error) {
    console.error("Error fetching community messages:", error);
    res.status(500).json({ message: "Could not load messages" });
  }
});

// Private conversation between the logged-in user and :otherUserId.
router.get("/personalMessages/:otherUserId", async (req, res) => {
  try {
    if (!isId(req.params.otherUserId)) return res.status(400).json({ message: "Invalid user" });
    const room = [req.userId, req.params.otherUserId].sort().join("_");
    const result = await readPage(PersonalMessage, { room }, "timestamp", req);
    if (result.error) return res.status(400).json({ message: result.error });
    res.json(result);
  } catch (error) {
    console.error("Error fetching personal messages:", error);
    res.status(500).json({ message: "Could not load messages" });
  }
});

module.exports = router;

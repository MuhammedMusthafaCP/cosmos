// Authentication from the JWT that /users/login stores in the httpOnly `token` cookie.
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const { jwtSecret } = require("../config/env");

// The token payload is { _id: <profile id> }. Returns that id, or null for a bad/expired token.
function verifyToken(token) {
  if (!token) return null;
  try {
    const { _id } = jwt.verify(token, jwtSecret);
    return _id ? String(_id) : null;
  } catch {
    return null;
  }
}

// Express: 401 unless the request carries a valid token. Sets req.userId.
function requireAuth(req, res, next) {
  const userId = verifyToken(req.cookies?.token || req.headers["x-access-token"]);
  if (!userId) return res.status(401).json({ message: "Please log in to continue" });
  req.userId = userId;
  return next();
}

// Socket.IO: same check on the websocket handshake's cookie header.
function userIdFromHandshake(handshake) {
  const header = handshake.headers?.cookie;
  if (!header) return null;
  return verifyToken(cookie.parse(header).token);
}

module.exports = { requireAuth, userIdFromHandshake, verifyToken };

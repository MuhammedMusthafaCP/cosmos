// Turns the two server message shapes into one shape the UI renders:
//   { id, own, senderKey, senderName, avatar, text, date: Date }

export function fromPersonal(message, me, other) {
  const own = String(message.senderId) === String(me._id);
  const who = own ? me : other;
  return {
    id: String(message._id),
    own,
    senderKey: String(message.senderId),
    senderName: who?.name || "",
    avatar: who?.profilePic,
    text: message.text,
    date: new Date(message.timestamp),
  };
}

export function fromCommunity(message, me) {
  // Older messages have no senderId; fall back to the name.
  const own = message.senderId ? String(message.senderId) === String(me._id) : message.name === me.name;
  return {
    id: String(message._id),
    own,
    senderKey: String(message.senderId || message.name),
    senderName: message.name,
    avatar: own ? me.profilePic : message.profile_picture,
    text: message.message,
    date: new Date(message.date),
  };
}

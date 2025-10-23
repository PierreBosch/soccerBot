const admins = [
  "554896742125@c.us",
  "554896106006@c.us",
  "554899423230@c.us",
  "251917179551812@lid"
];

function isAdmin(phoneId) {
  return admins.includes(phoneId)
}

module.exports = isAdmin
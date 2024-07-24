const admins = [
  "554896742125@c.us",
  "554896106006@c.us"
];

function isAdmin(phoneId) {
  return admins.includes(phoneId)
}

module.exports = isAdmin
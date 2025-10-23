function isGroupMessage(message) {
  return message.from.endsWith('@g.us');
}

module.exports = isGroupMessage
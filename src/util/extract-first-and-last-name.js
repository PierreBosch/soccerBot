function extractFirstAndLastName(fullName, onlyFirstName = false) {
  const words = fullName.trim().split(/\s+/);

  if(onlyFirstName) return words[0]

  if (words.length >= 2) {
      return words[0] + ' ' + words[1];
  } else {
      return fullName;
  }
}

module.exports = extractFirstAndLastName
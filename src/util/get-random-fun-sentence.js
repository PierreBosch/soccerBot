function getRandomFunSentence(sentences, name = '') {
  const randomId = Math.floor(Math.random() * sentences.length);
  const phrase = sentences[randomId];
  
  return phrase.replace(/{nome}/g, name);
}

module.exports = getRandomFunSentence
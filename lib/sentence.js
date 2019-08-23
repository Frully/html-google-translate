class Sentence {
  constructor(text, nodes) {
    this.text = text
    this.nodes = nodes
  }

  static createSentence(texts, nodes) {
    let text = ''

    if (texts.length === 1) {
      text = texts[0]
    } else {
      for (let i = 0; i < texts.length; i++) {
        text += `<a i=${i}>${texts[i]}</a>`
      }
    }

    return new Sentence(text, nodes)
  }
}

module.exports = {
  Sentence,
}
const { toDom } = require('./dom-utils')

class Sentence {
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

  constructor(text, nodes) {
    this.text = text
    this.nodes = nodes
  }

  update(text) {
    this.text = text
    if (this.nodes.length === 1) {
      this.nodes[0].data = text
    } else {
      this._updateMultiText(text)
    }
  }

  _updateMultiText(text) {
    const dom = toDom(text)
    
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].data = dom[i].children[0].data
    }
  }
}

module.exports = {
  Sentence,
}
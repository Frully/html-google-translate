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
    if (this.nodes.length === 1) {
      this.nodes[0].data = text
    } else {
      this._updateMultiText(text)
    }

    this.text = text
  }

  _updateMultiText(text) {
    let dom = toDom(text).filter(node => {
      return node.type === 'tag' && node.name === 'a'
    })


    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i]
      let transText = dom[i].children[0].data

      if (node.prev && needToSpace(transText[0])) {
        transText = ' ' + transText
      }

      if (node.next && needToSpace(transText[transText.length - 1])) {
        transText = transText + ' '
      }

      this.nodes[i].data = transText
    }
  }
}

function needToSpace(char) {
  if (!char) return false

  const c = char.charCodeAt(0)
  
  if (
    c === 32 || // blank
    c >= 3584 && c <= 3711 || // 3584 - 3711 Thai
    c >= 12288 && c <= 12351 || // 12288 - 12351 CJK Symbols and Punctuation
    c >= 12352 && c <= 12543 || // 12352 - 12543 Hiragana Katakana
    c >= 12784 && c <= 12799 || // 12784 - 12799 Katakana Phonetic Extensions
    c >= 19968 && c <= 40959 || // 19968 - 40959 CJK Unified Ideographs
    c >= 65280 && c <= 65519 // 65280 - 65519 Halfwidth and Fullwidth Forms
  ) {
    return false
  } {
    return true
  }
}

module.exports = {
  Sentence,
}
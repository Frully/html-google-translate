const { append, getOuterHTML } = require('htmlparser2').DomUtils

const { toDom, isTextNode, isInlineTextNode } = require('./dom-utils')

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

    let newNodes = toDom(text)

    if (newNodes.length === 1) {
      updateText(this.nodes[0], text)
      return
    }

    newNodes = newNodes.filter(node => {
      return node.type === 'tag' && node.name === 'a'
    })

    let map = {}

    for (let i = 0, lastNode = null; i < newNodes.length; i++) {
      const transNode = newNodes[i]

      for (const childNode of transNode.children) {
        let index
        let transText

        if (childNode.type === 'tag') {
          index = childNode.attribs.i
          transText = childNode.children[0].data
        } else {
          index = transNode.attribs.i
          transText = childNode.data
        }

        let node = this.nodes[index]

        if (map[index]) {
          node = clone(node)
          append(lastNode, node)
        }

        if (node.type === 'text') {
          if (needLeftSpace(node, transText)) {
            transText = ' ' + transText
          }

          if (needRightSpace(node, transText)) {
            transText = transText + ' '
          }
        }

        updateText(node, transText)
        map[index] = true
        lastNode = node
      }
    }
  }
}

function clone(node) {
  const html = getOuterHTML(node)
  return toDom(html)[0]
}

function updateText(node, text) {
  if (node.type === 'text') {
    node.data = text
  } else {
    node.children[0].data = text
  }
}

function needLeftSpace(node, text) {
  return node.prev && isInlineTextNode(node.prev) && !isNoneSpaceLang(text[0])
}

function needRightSpace(node, text) {
  return node.next && isInlineTextNode(node.next) && !isNoneSpaceLang(text[text.length - 1])
}

function isNoneSpaceLang(char) {
  if (!char) return false

  const c = char.charCodeAt(0)

  return c >= 3584 && c <= 3711 || // 3584 - 3711 Thai
    c >= 12288 && c <= 12351 || // 12288 - 12351 CJK Symbols and Punctuation
    c >= 12352 && c <= 12543 || // 12352 - 12543 Hiragana Katakana
    c >= 12784 && c <= 12799 || // 12784 - 12799 Katakana Phonetic Extensions
    c >= 19968 && c <= 40959 || // 19968 - 40959 CJK Unified Ideographs
    c >= 65280 && c <= 65519 // 65280 - 65519 Halfwidth and Fullwidth Forms
}

module.exports = {
  Sentence,
}
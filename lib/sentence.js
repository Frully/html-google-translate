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
    let transNodes = toDom(text)

    if (transNodes.length === 1) {
      updateText(this.nodes[0], text)
      return
    }

    transNodes = transNodes.filter(node => {
      return node.type === 'tag' && node.name === 'a'
    })

    handleTransNodes(transNodes, this.nodes)

    this.text = text
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

function handleTransNodes(transNodes, originalNodes, data = { map: {}, lastNode: null }) {
  for (let i = 0; i < transNodes.length; i++) {
    const transNode = transNodes[i]

    if (transNode.type === 'tag') {
      handleTransNodes(transNode.children, originalNodes, data)
      continue
    }

    index = transNode.parent.attribs.i
    transText = transNode.data

    let node = originalNodes[index]

    if (data.map[index]) {
      node = clone(node)
      append(data.lastNode, node)
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
    data.map[index] = true
    data.lastNode = node
  }
}

module.exports = {
  Sentence,
}
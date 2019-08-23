const { Sentence } = require('./sentence')
const { toDom } = require('./dom-utils')

function toMap(tags) {
  const map = {}
  tags.forEach(tag => map[tag] = true)
  return map
}

const inlineTextTags = toMap([
  'a', 'abbr', 'acronym', 'b', 'basefont', 'bdo', 'big', 'cite', 'dfn', 'em', 'font',
  'i', 'input', 'nobr', 'label', 'q', 's', 'small', 'span', 'strike', 'strong', 'sub',
  'sup', 'textarea', 'tt', 'u', 'var'])

const inlineNoneTextTags = toMap([
  'br', 'code', 'img', 'kbd', 'map', 'object', 'param', 'script', 'style', 'wbr', 'svg'
])

function separate(html) {
  const dom = toDom(html)
  const baskets = []

  dom.forEach(node => mine(node, { texts: [], nodes: [], done: false }, baskets))

  const sentences = baskets.map(basket => Sentence.createSentence(basket.texts, basket.nodes))

  return { dom, sentences }
}

function mine(node, basket, baskets) {
  if (isTextNode(node)) {
    if (!isEmptyString(node.data)) {
      basket.texts.push(node.data)
      basket.nodes.push(node)
    }
  } else if (node.children && node.children.length) {
    mine(node.children[0], basket, baskets)
  }

  if (isLastInlineTextNode(node)) {
    if (!basket.done && basket.texts.length) {
      baskets.push(basket)
      basket.done = true
    }
  }

  if (node.next) {
    if (isFirstInlineTextNode(node.next)) {
      basket = { texts: [], nodes: [], done: false }
    }

    mine(node.next, basket, baskets)
  }
}


function isEmptyString(str) {
  return !str.trim()
}

function isLastInlineTextNode(node) {
  return node.next ? !isInlineNode(node.next) :
    !node.parent || !isInlineNode(node.parent)
}

function isFirstInlineTextNode(node) {
  return (!isInlineNode(node.prev) && !isTextNode(node.prev)) ||
    (!isInlineNode(node) && !isTextNode(node))
}

function isTextNode(node) {
  return node.type === 'text'
}

function isInlineNode(node) {
  return isInlineTextNode(node) || isInlineNoneTextNode(node)
}

function isInlineTextNode(node) {
  return node.type === 'tag' && inlineTextTags[node.name]
}

function isInlineNoneTextNode(node) {
  return node.type === 'tag' && inlineNoneTextTags[node.name]
}

module.exports = {
  separate,
}
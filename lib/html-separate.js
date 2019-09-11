const { Sentence } = require('./sentence')
const {
  toDom,
  isLastInlineTextNode,
  isFirstInlineTextNode,
  isTextNode,
  isInlineTextNode,
  isTagNode,
  isDirectiveNode,
} = require('./dom-utils')

function separate(html) {
  let dom = toDom(html)

  if (isDirectiveNode(dom[0])) {
    dom = dom.filter(node => isTagNode(node))
  }

  const baskets = []

  dom.forEach(node => mine(node, getEmptyBasket(), baskets))

  const sentences = baskets.map(basket => Sentence.createSentence(basket.texts, basket.nodes))

  return { dom, sentences }
}

function mine(node, basket, baskets) {
  if (isInlineTextNode(node) && node.children.length === 1 && isTextNode(node.children[0])) {
    if (!isEmptyString(node.children[0].data)) {
      basket.texts.push(node.children[0].data)
      basket.nodes.push(node)
    }
  } else if (isTextNode(node)) {
    if (!isEmptyString(node.data)) {
      basket.texts.push(node.data)
      basket.nodes.push(node)
    }
  } else if (isTagNode(node) && node.children && node.children.length) {
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
      basket = getEmptyBasket()
    }

    mine(node.next, basket, baskets)
  }
}

function getEmptyBasket() {
  return { texts: [], nodes: [], done: false }
}


function isEmptyString(str) {
  return !str.trim()
}

module.exports = {
  separate,
}
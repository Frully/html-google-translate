const { parseDOM } = require('htmlparser2')
const render = require('dom-serializer')

function toDom(html) {
  return parseDOM(html.trim())
}

function toHtml(dom, options) {
  return render(dom, options)
}

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

function isTagNode(node) {
  return node.type === 'tag'
}

function isDirectiveNode(node) {
  return node.type === 'directive'
}

module.exports = {
  toDom,
  toHtml,
  isLastInlineTextNode,
  isFirstInlineTextNode,
  isTextNode,
  isTagNode,
  isInlineNode,
  isInlineTextNode,
  isInlineNoneTextNode,
  isDirectiveNode,
}
const { parseDOM } = require('htmlparser2')
const render = require('dom-serializer')

function toDom(html) {
  return parseDOM(html.trim())
}

function toHtml(dom, options) {
  return render(dom, options)
}

module.exports = {
  toDom,
  toHtml,
}
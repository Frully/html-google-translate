const { parseDOM } = require('htmlparser2')
const render = require('dom-serializer')

function toDom(html) {
  return parseDOM(html.trim())
}

function toHtml(dom) {
  return render(dom)
}

module.exports = {
  toDom,
  toHtml,
}
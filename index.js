const { default: translate, parseMultiple } = require('@frully/google-translate-open-api')

const { separate } = require('./lib/html-separate')
const { toHtml } = require('./lib/dom-utils')

async function translateHtml(html, options = {}) {
  const { dom, sentences } = separate(html)

  const texts = sentences.map(sentence => sentence.text)

  let result

  try {
    result = await translate(texts, options)
  } catch (err) {
    if (err.statusCode === 302 || err.statusCode === 403) {
      err = new Error('Was banned by the Google Translate API.')
    }
    throw err
  }

  let transTexts

  if (typeof result.data === 'string') {
    transTexts = [result.data]
  } else {
    transTexts = parseMultiple(result.data[0])
  }

  for (let i = 0; i < sentences.length; i++) {
    sentences[i].update(transTexts[i])
  }

  return toHtml(dom, options)
}

module.exports = translateHtml
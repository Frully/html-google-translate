const { separate } = require('../lib/html-separate')
const { toHtml } = require('../lib/dom-utils')

describe('lib/sentence.js', () => {
  it('能把译文更新到 node', () => {
    const { dom, sentences } = separate('<div><p id="a">Paragraph 1</p><p id="b">Paragraph 2</p></div>')

    sentences[0].update('Párrafo 1')
    sentences[1].update('Párrafo 2')

    const html = toHtml(dom)

    expect(html).toBe('<div><p id="a">Párrafo 1</p><p id="b">Párrafo 2</p></div>')
  })

  it('更新时能处理空格', () => {
    const { dom, sentences } = separate('<div><i>I</i> love <a href="#">you</a>!</div>')

    sentences[0].update('<a i=0>Me</a> <a i=1>encanta</a> <a i=2>que</a> <a i=3>!</a>')

    const html = toHtml(dom)

    expect(html).toBe('<div><i>Me</i> encanta <a href="#">que</a> !</div>')
  })

  it('更新时能处理无空格的中文', () => {
    const { dom, sentences } = separate('<div><i>I</i> love <a href="#">you</a>!</div>')

    sentences[0].update('<a i=0>我</a> <a i=1>爱</a> <a i=2>你</a> <a i=3>！</a>')

    const html = toHtml(dom)

    expect(html).toBe('<div><i>我</i>爱<a href="#">你</a>！</div>')
  })

  it.todo('更新时能正确处理标点符号前后的空格')
})
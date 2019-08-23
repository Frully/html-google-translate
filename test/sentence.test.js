const { separate } = require('../lib/html-separate')
const { toHtml } = require('../lib/dom-utils')

describe.only('sentence.js', () => {
  it('能把译文恢复到 node', () => {
    const { dom, sentences } = separate('<div><p id="a">Paragraph 1</p><p id="b">Paragraph 2</p></div>')

    sentences[0].update('段落 1')
    sentences[1].update('段落 2')

    const html = toHtml(dom)

    expect(html).toBe('<div><p id="a">段落 1</p><p id="b">段落 2</p></div>')
  })

  it('能把多节点的译文恢复到 node', () => {
    const { dom, sentences } = separate('<div><p id="a">Paragraph 1 <i id="b"><a href="#" id="c">inline</a><b id="d">BIG</b></i></p></div>')

    sentences[0].update('<a i=0>段落 1 </a><a i=1>行内</a><a i=2>大</a>')

    const html = toHtml(dom)

    expect(html).toBe('<div><p id="a">段落 1 <i id="b"><a href="#" id="c">行内</a><b id="d">大</b></i></p></div>')
  })
})
const { separate } = require('../lib/html-separate')

describe('lib/html-separate.js', () => {
  it('能拆分文字节点', () => {
    const { sentences } = separate('<div><p id="a">Paragraph 1</p><p id="b">Paragraph 2</p></div>')

    expect(sentences.length).toBe(2)
    expect(sentences[0].text).toBe('Paragraph 1')
    expect(sentences[0].nodes.length).toBe(1)
    expect(sentences[0].nodes[0].parent.attribs.id).toBe('a')
    expect(sentences[1].text).toBe('Paragraph 2')
    expect(sentences[1].nodes.length).toBe(1)
    expect(sentences[1].nodes[0].parent.attribs.id).toBe('b')
  })

  it('能拆分文字包含行内元素的节点', () => {
    const { sentences } = separate('<div><p id="a">Paragraph 1 <i id="b">inline</i></p></div>')

    expect(sentences.length).toBe(1)
    expect(sentences[0].text).toBe('<a i=0>Paragraph 1 </a><a i=1>inline</a>')
    expect(sentences[0].nodes.length).toBe(2)
    expect(sentences[0].nodes[0].parent.attribs.id).toBe('a')
    expect(sentences[0].nodes[1].attribs.id).toBe('b')
  })

  it('能拆分文字包含多层行内元素的节点', () => {
    const { sentences } = separate('<div><p id="a">Paragraph 1 <i id="b"><a href="#" id="c">inline</a><b id="d">BIG</b></i></p></div>')

    expect(sentences.length).toBe(1)
    expect(sentences[0].text).toBe('<a i=0>Paragraph 1 </a><a i=1>inline</a><a i=2>BIG</a>')
    expect(sentences[0].nodes.length).toBe(3)
    expect(sentences[0].nodes[0].parent.attribs.id).toBe('a')
    expect(sentences[0].nodes[1].attribs.id).toBe('c')
    expect(sentences[0].nodes[2].attribs.id).toBe('d')
  })

  it('处理<br />', () => {
    const { sentences } = separate('<div><p id="a">Paragraph 1<br /> good</p></div>')

    expect(sentences.length).toBe(1)
    expect(sentences[0].text).toBe('<a i=0>Paragraph 1</a><a i=1> good</a>')
    expect(sentences[0].nodes.length).toBe(2)
    expect(sentences[0].nodes[0].parent.attribs.id).toBe('a')
    expect(sentences[0].nodes[1].parent.attribs.id).toBe('a')
  })

  it('处理<img />', () => {
    const { sentences } = separate('<div><p id="a">Paragraph 1<img /> good</p></div>')

    expect(sentences.length).toBe(1)
    expect(sentences[0].text).toBe('<a i=0>Paragraph 1</a><a i=1> good</a>')
    expect(sentences[0].nodes.length).toBe(2)
    expect(sentences[0].nodes[0].parent.attribs.id).toBe('a')
    expect(sentences[0].nodes[1].parent.attribs.id).toBe('a')
  })

  it('处理<hr>', () => {
    const { sentences } = separate('<div><p id="a">Paragraph 1 <hr> good</p></div>')

    expect(sentences.length).toBe(2)
    expect(sentences[0].text).toBe('Paragraph 1 ')
    expect(sentences[0].nodes.length).toBe(1)
    expect(sentences[0].nodes[0].parent.attribs.id).toBe('a')
    expect(sentences[1].text).toBe(' good')
    expect(sentences[1].nodes.length).toBe(1)
    expect(sentences[1].nodes[0].data).toBe(' good')
  })

  it('能处理行内块元素', () => {
    const { sentences } = separate('<div><p id="a">Paragraph 1 <div id="b">block</div> good</p></div>')

    expect(sentences.length).toBe(3)
    expect(sentences[0].text).toBe('Paragraph 1 ')
    expect(sentences[0].nodes.length).toBe(1)
    expect(sentences[0].nodes[0].parent.attribs.id).toBe('a')
    expect(sentences[1].text).toBe('block')
    expect(sentences[1].nodes.length).toBe(1)
    expect(sentences[1].nodes[0].data).toBe('block')
    expect(sentences[2].text).toBe(' good')
    expect(sentences[2].nodes.length).toBe(1)
    expect(sentences[2].nodes[0].data).toBe(' good')
  })
  it('能过滤空白', () => {
    const { sentences } = separate('<div><p id="a">Paragraph 1 <span> </span> good</p></div>')

    expect(sentences.length).toBe(1)
    expect(sentences[0].text).toBe('<a i=0>Paragraph 1 </a><a i=1> good</a>')
    expect(sentences[0].nodes.length).toBe(2)
    expect(sentences[0].nodes[0].parent.attribs.id).toBe('a')
    expect(sentences[0].nodes[1].parent.attribs.id).toBe('a')
  })

  it('能过滤换行和空白', () => {
    const { sentences } = separate(`<div>
    <p id="a">Paragraph 1
      <div id="b">block</div>
      good</p>
    </div>`)

    expect(sentences.length).toBe(3)
    expect(sentences[0].text).toBe(`Paragraph 1\n      `)
    expect(sentences[0].nodes.length).toBe(1)
    expect(sentences[0].nodes[0].parent.attribs.id).toBe('a')
    expect(sentences[1].text).toBe('block')
    expect(sentences[1].nodes.length).toBe(1)
    expect(sentences[1].nodes[0].data).toBe('block')
    expect(sentences[2].text).toBe('\n      good')
    expect(sentences[2].nodes.length).toBe(1)
  })

  it('能处理前后有空白的情况', () => {
    const { sentences } = separate(` <div><p id="a">Paragraph 1</p><p id="b">Paragraph 2</p></div> `)

    expect(sentences.length).toBe(2)
    expect(sentences[0].text).toBe('Paragraph 1')
    expect(sentences[0].nodes.length).toBe(1)
    expect(sentences[0].nodes[0].parent.attribs.id).toBe('a')
    expect(sentences[1].text).toBe('Paragraph 2')
    expect(sentences[1].nodes.length).toBe(1)
    expect(sentences[1].nodes[0].parent.attribs.id).toBe('b')
  })


  it('能处理转移符', () => {
    const { sentences } = separate('<div><p id="a">&quot;BIG&quot; <a href="#" id="b">inline</a></p></div>')

    expect(sentences.length).toBe(1)
    expect(sentences[0].text).toBe('<a i=0>&quot;BIG&quot; </a><a i=1>inline</a>')
    expect(sentences[0].nodes.length).toBe(2)
    expect(sentences[0].nodes[0].parent.attribs.id).toBe('a')
    expect(sentences[0].nodes[1].attribs.id).toBe('b')
  })


  it('能正确解析 xhtml', () => {
    html = `<?xml version='1.0' encoding='utf-8'?>\n<p><span>a</span><span>b</span><span>c</span></p>`
    const { sentences } = separate(html)
    expect(sentences.length).toBe(1)
  })
})
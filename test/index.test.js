const translate = require('../index')

describe('index.js', () => {
  it('能翻译', async () => {
    const html = '<div><i>I</i> love <a href="#">you</a>!</div>'

    const transHtml = await translate(html, {
      from: 'en',
      to: 'zh-CN',
    })

    expect(transHtml).toBe('<div><i>我</i>爱<a href=\"#\">你</a>！</div>')
  })
})
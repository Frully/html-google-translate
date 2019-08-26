const translate = require('../index')

describe('index.js', () => {
  it('能翻译单句', async () => {
    const html = '<p><i>I</i> love <a href="#">you</a>!</p>'

    const transHtml = await translate(html, {
      from: 'en',
      to: 'es',
      tld: 'cn',
    })

    expect(transHtml).toBe('<p><i>Me</i> encanta <a href="#">que</a> !</p>')
  })

  it('能翻译多句', async () => {
    const html = '<div><p><i>I</i> love <a href="#">you</a>!</p><p>You love me.</p></div>'

    const transHtml = await translate(html, {
      from: 'en',
      to: 'es',
      tld: 'cn',
    })

    expect(transHtml).toBe('<div><p><i>Me</i> encanta <a href="#">que</a> !</p><p>Me amas.</p></div>')
  })
})
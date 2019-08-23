# html-google-translate

Translate HTML with Google Translate and maintain the original structures of sentences and HTML.

## Installation

```shell
$ npm i html-google-translate
```

## Usage
```js
const translate = require('html-google-translate');

const html = '<p>I Love <b>Node.js</b>!</p>'

const transHtml = await translate(html, {
  from: 'en',
  to: 'zh-CN',
})

// '<p>我喜欢<b>Node.js</b>!</p>'
```
# html-google-translate

Translate HTML with Google Translate and maintain the original structures of sentences and HTML.

```js
const html = '<p><i>I</i> love <a href="#">you</a>!</p>'

const transHtml = await translate(html, {
  from: 'en',
  to: 'es',
})

// '<p><i>Me</i> encanta <a href="#">que</a> !</p>'
```

## Installation

```shell
$ npm install html-google-translate
```

## API

### translate(html, options)

```js
const transHtml = await translate(html, {
  from: 'auto',
  to: 'en',
  tld: 'com',
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'username',
      password: 'password',
    },
  },
  xmlMode: false,
})
```

#### html
Type: `string`

The HTML to be translated

#### options
Type: `object`

##### from
Type: `string` | `'auto'`

The `html` language. Must be `auto` or one of the codes/names (not case sensitive) contained in [languages.ts](https://github.com/hua1995116/google-translate-open-api/blob/master/src/language.ts)

##### to
Type: `string`

The language in which the HTML should be translated. Must be one of the codes/names (case sensitive!) contained in [languages.ts](https://github.com/hua1995116/google-translate-open-api/blob/master/src/language.ts).

##### tld
Type: `string` Default: `'com'`

TLD for Google translate host to be used in API calls: `https://translate.google.{tld}`.

#### proxy
Type: `AxiosProxyConfig` | `false` Default: `false`

Proxy for request, [AxiosProxyConfig](https://github.com/axios/axios/blob/2ee3b482456cd2a09ccbd3a4b0c20f3d0c5a5644/index.d.ts#L14).

### xmlMode
Type: `boolean` | `'foreign'` Default: `false`

Indicate whether to render the result in XML.
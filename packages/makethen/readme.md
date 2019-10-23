# makethen

[![npm](https://img.shields.io/npm/v/makethen.svg?style=flat-square)](https://www.npmjs.com/package/makethen) [![tests](https://img.shields.io/travis/deepsweet/makethen/master.svg?label=tests&style=flat-square)](https://travis-ci.org/deepsweet/makethen) [![coverage](https://img.shields.io/codecov/c/github/deepsweet/makethen.svg?style=flat-square)](https://codecov.io/github/deepsweet/makethen)

Strongly typed (up to 3 arguments and 3 result params) promisify for Node.js-style callbacks.

## Requirements

* Node.js >= 8.6.0

## Install

```sh
$ yarn add makethen
```

## Usage

```js
import { readFile } from 'fs'
import makethen from 'makethen'

makethen(readFile)('foo.txt', 'utf8')
  .then((data) => {
    // …
  })
  .catch((error) => {
    // …
  })
```

```js
import request from 'request'
import makethen from 'makethen'

makethen(request)('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  .then(([ response, body ]) => {
    // …
  })
  .catch((error) => {
    // …
  })
```

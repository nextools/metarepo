# mocku

[![npm](https://img.shields.io/npm/v/mocku.svg?style=flat-square)](https://www.npmjs.com/package/mocku) [![tests](https://img.shields.io/travis/deepsweet/mocku/master.svg?label=tests&style=flat-square)](https://travis-ci.org/deepsweet/mocku) [![coverage](https://img.shields.io/codecov/c/github/deepsweet/mocku.svg?style=flat-square)](https://codecov.io/github/deepsweet/mocku)

Mocking library.

## Requirements

* Node.js >= 8.6.0

## Install

```sh
$ yarn add --dev mocku
```

## Usage

```js
import { mock, unmock, deleteFromCache } from 'mocku'

mock('./file', {
  './file2': {
    default: 'file2'
  },
  fs: {
    readFile: 'readFile'
  }
})

import('./file')
  .then(console.log)
  .then(() => {
    unmock('./file')

    return import('./file')
  })
  .then(console.log)
  .catch(console.error)
```

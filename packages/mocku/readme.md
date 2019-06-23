# mocku

Mocking library.

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

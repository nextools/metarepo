# mocku

Mocking library.

## Install

```sh
$ yarn add --dev mocku
```

## Usage

```js
import { mock, deleteFromCache } from 'mocku'

const unmock = mock('./file', {
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
    unmock()

    return import('./file')
  })
  .then(console.log)
  .catch(console.error)
```

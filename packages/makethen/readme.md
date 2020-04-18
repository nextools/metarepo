# makethen ![npm](https://flat.badgen.net/npm/v/makethen)

Strongly typed (up to 3 arguments and 3 result params) promisify for Node.js-style callbacks.

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

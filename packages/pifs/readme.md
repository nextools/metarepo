# pifs ![npm](https://flat.badgen.net/npm/v/pifs)

Promisified [graceful-fs](https://github.com/isaacs/node-graceful-fs).

* aligned with Node.js v12
* native `util.promisify()`
* no sync methods
* no deprecated methods like `exists`
* no undocumented exports like `FileReadStream` or `F_OK`
* no `promises` :)
* non-callback methods like `createReadStream` or `watch` are re-exported as is
* `constants` is re-exported as is

## Install

```sh
$ yarn add pifs
```

## Usage

```js
import { readFile } from 'pifs'

readFile('/file/path', 'utf8')
  .then(console.log)
  .catch(console.error)
```

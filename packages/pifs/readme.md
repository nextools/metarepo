# pifs

Promisified [graceful-fs](https://github.com/isaacs/node-graceful-fs).

* native `util.promisify()`
* no sync methods
* no deprecated methods like `exists`
* non-callback methods like `createReadStream` are re-exported as is
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

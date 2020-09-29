# globl ![npm](https://flat.badgen.net/npm/v/globl)

Exported globals it would be nice to mock.

* `setTimeout`
* `clearTimeout`
* `setInterval`
* `clearInterval`
* `setImmediate`
* `clearImmediate`
* `requestAnimationFrame`
* `cancelAnimationFrame`
* `console`
* `process`
* `Date`
* `performance`

## Install

```sh
$ yarn add globl
```

## Usage

```ts
import { setTimeout } from 'globl'

setTimeout(() => {
  console.log('Time\'s up')
}, 1000)
```

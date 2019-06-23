# spyfn

Spy function.

## Install

```sh
$ yarn add --dev spyfn
```

## Usage

```js
import { createSpy, getSpyCalls } from 'spyfn'

const spy = createSpy(({ index, args }) => {
  switch (index) {
    case 0: {
      return `first call result, args: ${args}`
    }
    case 1: {
      return `second call result, args: ${args}`
    }
    default: {
      return `3+ call result, args: ${args}`
    }
  }
})

console.log(spy('foo')) // first call result, args: ['foo']
console.log(spy('bar')) // second call result, args: ['bar']
console.log(getSpyCalls(spy)) // [['foo'], ['bar']]

console.log(spy('baz')) // 3+ call result, args: ['baz']
console.log(spy('qux')) // 3+ call result, args: ['qux']
console.log(getSpyCalls(spy)) // [['foo'], ['bar'], ['baz'], ['qux']]
```

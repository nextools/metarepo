# 🔀 plugin-concurrent

Run plugins concurrently.

## Install

```sh
$ yarn add --dev @start/plugin-concurrent
```

## Usage

### Signature

```ts
concurrent(...plugins: StartPlugin[])
```

### Example

```js
import concurrent from '@start/plugin-sequence'
import remove from '@start/plugin-remove'

export const task = () =>
  concurrent(
    remove('foo/'),
    remove('bar/') 
  )
```

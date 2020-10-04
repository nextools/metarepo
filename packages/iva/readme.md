# iva

Glob matching as [async iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator).

## Install

```sh
$ yarn add iva
```

## Usage

```ts
const matchGlobs: (globs: Iterable<string>) => AsyncIterable<string>
```

```ts
import { matchGlobs } from 'iva'

const pathIterable = matchGlobs(['packages/*/src/*.ts', '!packages/foo/**'])

for await (const path of pathIterable) {
  console.log(path)
}
```

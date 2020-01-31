# perfa

Measure React app performance using dockerized Chromium through [`xrom`](https://github.com/bubble-dev/_/tree/master/packages/xrom) lib.

## Install

```sh
$ yarn add perfa
```

## Usage

```ts
type Options = {
  entryPointPath: string, // path to a React app entry point
  triesCount?: number, // `5` by default
  fontsDir?: string, // path to a directory with custom fonts to be installed
  isQuiet?: boolean, // `false` by default
}

type Result = {
  firstContentfulPaint: number,
  firstMeaningfulPaint: number,
  largestContentfulPaint: number,
  domContentLoaded: number,
  threadTime: number,
  scriptDuration: number,
  layoutDuration: number,
  recalcStyleDuration: number,
  usedJsHeapSize: number,
}

perfa(options: Options) => Promise<Result>
```

```js
import { getPerfData } from 'perfa'

const perfData = await getPerfData({
  entryPointPath: './App.tsx'
})
```

# 💯 plugin-lib-istanbul

Collect, report and check code coverage using [Istanbul](https://istanbul.js.org/).

## Install

```sh
$ yarn add --dev @start/plugin-lib-istanbul
```

## Usage

### Signature

```ts
istanbulInstrument(options?: InstrumenterOptions, extensions?: string[])
```

#### `options`

[Istanbul instrumenter options](https://github.com/istanbuljs/istanbuljs/blob/9f8aebf1f08159df20358d77fe98c809d2027c5f/packages/istanbul-lib-instrument/src/instrumenter.js#L11-L42)

#### `extensions`

File extensions to instrument, for example `['.ts']`

```ts
istanbulReports(formats: string[] = ['lcovonly', 'text-summary'])
```

```ts
istanbulThresholds(options: {
  branches?: number,
  functions?: number,
  lines?: number,
  statements?: number
})
```

### Example

```js
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import {
  istanbulInstrument,
  istanbulReport,
  istanbulThresholds
} from '@start/plugin-lib-istanbul'
import tape from '@start/plugin-lib-tape'

export const task = () =>
  sequence(
    find('src/**/*.js'),
    istanbulInstrument({ esModules: true }),
    find('test/**/*.js'),
    tape(),
    istanbulReport(['lcovonly', 'html', 'text-summary']),
    istanbulThresholds({ functions: 100 })
  )
```

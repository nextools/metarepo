# ✅ plugin-lib-karma

Run tests using [Karma](https://github.com/karma-runner/karma).

## Install

```sh
$ yarn add --dev @start/plugin-lib-karma
```

## Usage

### Signature

```ts
karma(options: {})
```

#### `options`

[Karma config options](https://karma-runner.github.io/2.0/config/configuration-file.html).

### Example

```js
import karma from '@start/plugin-lib-karma'

export const task = () => karma({
  browsers: [ 'Chrome', 'Firefox' ],
  files: [
    'test/index.js'
  ],
  singleRun: true
})
```

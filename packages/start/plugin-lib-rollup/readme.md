# 🏭 plugin-lib-rollup

Bundle files using [Rollup](https://rollupjs.org/).

## Install

```sh
$ yarn add --dev @start/plugin-lib-rollup
```

## Usage

### Signature

```ts
rollup(config: {})
```

#### `config`

[Rollup configuration](https://rollupjs.org/guide/en#configuration-files).

### Example

```js
import sequence from '@start/plugin-sequence'
import env from '@start/plugin-env'
import rollup from '@start/plugin-lib-rollup'

export const task = async () => {
  const { default: rollupConfig } = await import('./rollup.config')

  return sequence(
    env('NODE_ENV', 'production'),
    rollup(rollupConfig)
  )
}
```

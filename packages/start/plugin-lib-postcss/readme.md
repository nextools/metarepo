# 🏭 plugin-lib-postcss

Transform files using [PostCSS](https://postcss.org/).

## Install

```sh
$ yarn add --dev @start/plugin-lib-postcss
```

## Usage

### Signature

```ts
postcss(options?: {})
```

#### `options`

* `plugins` – an array of [PostCSS plugins](https://github.com/postcss/postcss#plugins)
* `sourceMaps` – boolean whether to process source maps or not
* `parser`, `stringifier`, `syntax` – [PostCSS options](https://github.com/postcss/postcss#options)

### Example

```js
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import read from '@start/plugin-read'
import postcss from '@start/plugin-lib-postcss'
import write from '@start/plugin-write'

import autoprefixer from 'autoprefixer'

export const task = () =>
  sequence(
    find('src/**/*.css'),
    read,
    postcss({
      plugins: [autoprefixer],
      sourceMaps: true
    }),
    write('build/')
  )
```

# stili

Universal React/React Native styles normalizer.

## Install

```sh
$ yarn add stili
```

## Usage

```ts
normalizeStyle(style: TStyle) => TCssProps
```

* `TStyle` – normalized styles
* `TCssProps` – platform-specific styles

```ts
import { normalizeStyle } from 'stili'

normalizeStyle({ lineHeight: 16 })
// `browser` package.json field target: { lineHeight: '16px' }
// `react-native` package.json field target: { lineHeight: 16 }
```

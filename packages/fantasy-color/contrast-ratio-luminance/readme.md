# @fantasy-color/contrast-ratio-luminance

Calculate the [contrast ratio](../#contrast-ratio) between two [relative luminances](../#relative-luminance)

```ts
type contrastRatioLuminance = (luminance1: number, luminance2: number) => number
```

Example usage:

```js
import contrastRatioLuminance from '@fantasy-color/contrast-ratio-luminance'

contrastRatioLuminance(0.5, 0.8)
// > 1.5454545454545454
```

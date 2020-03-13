# @fantasy-color/luminance-for-contrast-ratio

Calculate the [contrast ratio](../#contrast-ratio) between two [relative luminances](../#relative-luminance)

```ts
type luminanceForContrastRatio = (contrastRatio: number, luminance: number) => number
```

Example usage:

```js
import luminanceForContrastRatio from '@fantasy-color/luminance-for-contrast-ratio'

luminanceForContrastRatio(3, 0.8)
// > 0.2333333333333334
```

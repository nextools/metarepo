# @fantasy-color/contrast-ratio-rgb

Calculate the [contrast ratio](../#contrast-ratio) between two `RGB` objects.

```ts
type contrastRatioLuminance = (rgb1: RGB, rgb2: RGB) => number
```

Example usage:

```js
import contrastRatioRgb from '@fantasy-color/contrast-ratio-rgb'

contrastRatioRgb(
  { red: 255, green: 0, blue: 0 },
  { red: 0, green: 0, blue: 255 }
)
// > 2.148936170212766
```

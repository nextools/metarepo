# @fantasy-color/hsva-to-hsv

Transform a `HSVA` color object to a `HSV` color object.

```ts
type hsvaToHsv = (color: HSVA) => HSV
```

Example usage:

```js
import hsvaToHsv from '@fantasy-color/hsva-to-hsv'

hsvaToHsv({
  hue: 60,
  saturation: 32,
  value: 23,
  alpha: 1
})
// { hue: 60, saturation: 32, value: 23 }
```

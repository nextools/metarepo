# @fantasy-color/hsv-to-hsva

Transform a `HSV` color object to a `HSVA` color object.

```ts
type hsvToHsva = (color: HSV) => HSVA
```

Example usage:

```js
import hsvToHsva from '@fantasy-color/hsv-to-hsva'

hsvToHsva({
  hue: 60,
  saturation: 32,
  value: 23
})
// { hue: 60, saturation: 32, value: 23, alpha: 1 }
```

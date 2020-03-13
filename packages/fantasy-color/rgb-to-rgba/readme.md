# @fantasy-color/rgb-to-rgba

Transform a `RGB` color object to a `RGBA` color object.

```ts
type rgbToRgba = (color: RGB) => RGBA
```

Example usage:

```js
import rgbToRgba from '@fantasy-color/rgb-to-rgba'

rgbToRgba({
  red: 60,
  green: 32,
  blue: 23
})
// { red: 60, green: 32, blue: 23, alpha: 1 }
```

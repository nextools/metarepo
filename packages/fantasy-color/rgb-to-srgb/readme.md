# @fantasy-color/rgb-to-srgb

Transform a `RGB` color object from the RGB space in 0-255 to the sRGB color space. The object output type is still RGB

```typescript
type rgbToSrgb = (color: RGB) => RGB
```

Example usage:

```javascript
import rgbToSrgb from '@fantasy-color/rgb-to-srgb'

rgbToSrgb({
  red: 78,
  green: 63,
  blue: 22,
})
// { red: 0.07618538148130785, green: 0.04970656598412723, blue: 0.008023192985384994 }
```

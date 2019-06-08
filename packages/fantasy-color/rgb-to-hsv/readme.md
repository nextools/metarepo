# @fantasy-color/rgb-to-hsv

Transform a `RGB` color object to a `HSV` color object.

```typescript
type rgbToHsv = (color: RGB) => HSV
```

Example usage:

```javascript
import rgbToHsv from '@fantasy-color/rgb-to-hsv'

rgbToHsv({
  red: 60,
  green: 32,
  blue: 23
})
// { hue: 15, saturation: 62, value: 24 }
```

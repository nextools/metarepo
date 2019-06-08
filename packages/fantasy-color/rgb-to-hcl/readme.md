# @fantasy-color/rgb-to-hcl

Transform a `RGB` color object to a `HCL` color object.

```typescript
type rgbToHcl = (color: RGB) => HCL
```

Example usage:

```javascript
import rgbToHcl from '@fantasy-color/rgb-to-hcl'

rgbToHcl({
  red: 60,
  green: 32,
  blue: 23
})
// { hue: 42.99820879411349, chroma: 17.893501433259868, luminance: 15.966897718378611 }
```

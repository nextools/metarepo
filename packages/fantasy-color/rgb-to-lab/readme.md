# @fantasy-color/rgb-to-lab

Transform a `RGB` color object to a `LAB` color object.

```typescript
type rgbToLab = (color: RGB) => LAB
```

Example usage:

```javascript
import rgbToLab from '@fantasy-color/rgb-to-lab'

rgbToLab({
  red: 60,
  green: 32,
  blue: 23
})
// { luminance: 15.966897718378611, a: 13.086860007892998, b: 12.202929512042749 }
```

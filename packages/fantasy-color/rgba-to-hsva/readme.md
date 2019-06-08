# @fantasy-color/rgba-to-hsva

Transform a `RGBA` color object to a `HSVA` color object.

```typescript
type rgbaToHsva = (color: RGBA) => HSVA
```

Example usage:

```javascript
import rgbaToHsva from '@fantasy-color/rgba-to-hsva'

rgbaToHsva({
  red: 60,
  green: 32,
  blue: 23,
  alpha: 0.5
})
// { hue: 15, saturation: 62, value: 24, alpha: 0.5 }
```

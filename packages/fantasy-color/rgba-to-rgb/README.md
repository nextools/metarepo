# @fantasy-color/rgba-to-rgb

Transform a `RGBA` color object to a `RGB` color object.

```typescript
type rgbaToRgb = (color: RGBA) => RGB
```

Example usage:

```javascript
import rgbaToRgb from '@fantasy-color/rgba-to-rgb'

rgbaToRgb({
  red: 60,
  green: 32,
  blue: 23,
  alpha: 0.2
})
// { red: 60, green: 32, blue: 23 }
```

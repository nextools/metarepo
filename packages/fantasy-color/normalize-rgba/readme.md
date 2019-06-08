# @fantasy-color/normalize-rgba

Turn an `RGBA` color value from 0-255 to take a value from 0-1

```typescript
type normalizeRgba = (color: RGBA) => RGBA
```

Example usage:

```javascript
import normalizeRgba from '@fantasy-color/normalize-rgba'

normalizeRgba({
  red: 255,
  green: 70,
  blue: 50,
  alpha: 0.3
})
// > { red: 1, green: 0.27450980392156865, blue: 0.19607843137254902, alpha: 0.3 }
```

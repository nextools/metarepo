# @fantasy-color/normalize-rgb

Turn an `RGB` color value from 0-255 to take a value from 0-1

```typescript
type normalizeRgb = (color: RGB) => RGB
```

Example usage:

```javascript
import normalizeRgb from '@fantasy-color/normalize-rgb'

normalizeRgb({
  red: 255,
  green: 70,
  blue: 50
})
// > { red: 1, green: 0.27450980392156865, blue: 0.19607843137254902 }
```

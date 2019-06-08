# @fantasy-color/invert-rgb

Invert the `RGB` color object.

```typescript
type invertRgb = (color: RGB) => RGB
```

Example usage:

```javascript
import invertRgb from '@fantasy-color/invert-rgb'

invertRgb({
  red: 60,
  green: 32,
  blue: 23
})
// { red: 195, green: 223, blue: 232 }
```

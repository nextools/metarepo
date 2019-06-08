# @fantasy-color/lab-to-rgb

Transform a `LAB` color object to a `RGB` color object.

```typescript
type labToRgb = (color: LAB) => RGB
```

Example usage:

```javascript
import labToRgb from '@fantasy-color/lab-to-rgb'

labToRgb({
  luminance: 29.567572863553245,
  a: 68.29865326565671,
  b: -112.02942991288025
})
// { red: 0, green: 0, blue: 255 }
```

# @fantasy-color/hsv-to-rgb

Transform a `HSV` color object to a `RGB` color object.

```typescript
type hsvToRgb = (color: HSV) => RGB
```

Example usage:

```javascript
import hsvToRgb from '@fantasy-color/hsv-to-rgb'

hsvToRgb({
  hue: 180,
  saturation: 100,
  value: 100
})
// { red: 0, green: 255, blue: 255 }
```

# @fantasy-color/hsva-to-rgba

Transform a `HSVA` color object to a `RGBA` color object.

```typescript
type hsvaToRgba = (color: HSVA) => RGBA
```

Example usage:

```javascript
import hsvaToRgba from '@fantasy-color/hsva-to-rgba'

hsvaToRgba({
  hue: 180,
  saturation: 100,
  value: 100,
  alpha: 0.6
})
// { red: 0, green: 255, blue: 255, alpha: 0.6 }
```

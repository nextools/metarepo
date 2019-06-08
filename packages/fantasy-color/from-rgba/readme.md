# @fantasy-color/from-rgba

Parse a CSS RGBA string into a `RGBA` object.

```typescript
type fromRgba = (rgb: string) => RGBA
```

Example usage:

```javascript
import fromRgba from '@fantasy-color/from-rgba'

fromRgba('rgb(0, 250, 10, 0.6)')
// { red: 0, green: 250, blue: 10, alpha: 0.6 }
```

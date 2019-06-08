# @fantasy-color/luminance-srgb

Calculate the [relative luminance](../#relative-luminance) of an `RGB` color, coded as [sRGB](../#why-srgb)

```typescript
type luminanceSrgb = (color: RGB) => number
```

Example usage:

```javascript
import luminanceSrgb from '@fantasy-color/luminance-srgb'

luminanceSrgb({
  red: 1,
  green: 0.27,
  blue: 0.2
})
// > 0.420144
```

# @fantasy-color/from-rgb

Parse a CSS RGB string into a `RGB` object.

```typescript
type fromRgb = (rgb: string) => RGB
```

Example usage:

```javascript
import fromRgb from '@fantasy-color/from-rgb'

fromRgb('rgb(0, 250, 10)')
// { red: 0, green: 250, blue: 10 }
```

# @fantasy-color/from-hex

Parse a CSS HEX string into a `RGB` object.

```typescript
type fromHex = (hex: string) => RGB
```

Example usage:

```javascript
import fromHex from '@fantasy-color/from-hex'

fromHex('#FFFF00')
// { red: 255, green: 255, blue: 0 }
```

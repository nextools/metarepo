# @fantasy-color/lab-to-hcl

Transform a `LAB` color object to a `HCL` color object.

```typescript
type labToHcl = (color: LAB) => HCL
```

Example usage:

```javascript
import labToHcl from '@fantasy-color/lab-to-hcl'

labToHcl({
  luminance: 54.29173376861782,
  a: 80.8124553179771,
  b: 69.88504032350531
})
// { hue: 40.85261277607024, chroma: 106.83899941284552, luminance: 54.29173376861782 }
```

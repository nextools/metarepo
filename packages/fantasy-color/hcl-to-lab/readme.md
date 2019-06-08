# @fantasy-color/hcl-to-lab

Transform a `HCL` color object to a `LAB` color object.

```typescript
type hclToLab = (color: HCL) => LAB
```

Example usage:

```javascript
import hclToLab from '@fantasy-color/hcl-to-lab'

hclToLab({
  hue: 40.85261277607024,
  chroma: 106.83899941284552,
  luminance: 54.29173376861782
})
// { luminance: 54.29173376861782, a: 80.8124553179771, b: 69.88504032350531 }
```

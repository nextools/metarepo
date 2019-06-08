# @fantasy-color/luminance-for-contrast-ratio

Calculate the [contrast ratio](../#contrast-ratio) between two [relative luminances](../#relative-luminance)

```typescript
type luminanceForContrastRatio = (contrastRatio: number, luminance: number) => number
```

Example usage:

```javascript
import luminanceForContrastRatio from '@fantasy-color/luminance-for-contrast-ratio'

luminanceForContrastRatio(3, 0.8)
// > 0.2333333333333334
```

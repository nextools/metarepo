# @fantasy-color/hcl-to-rgb

Transform a `HCL` color object to a `RGB` color object.

```typescript
type hclToRgb = (color: HCL) => RGB
```

Example usage:

```javascript
import hclToRgb from '@fantasy-color/hcl-to-rgb'

hclToRgb({
  hue: 40.85261277607024,
  chroma: 106.83899941284552,
  luminance: 54.29173376861782
})
// { red: 255, green: 0, blue: 0 }
```

Note that this transformation can yield results where the values of the colors are outside the 0-255 boundary. So for example, dark red:

```javascript
import hclToRgb from '@fantasy-color/hcl-to-rgb'

hclToRgb({
  hue: 40.85261277607024,
  chroma: 106.83899941284552,
  luminance: 24.29173376861782
})
// { red: 157, green: -147, blue: -70 }
```

…yields `-147` for `green` and `-70` for `blue`. These are **valid CSS values**:

> Colors outside the sRGB gamut can be specified in Cascading Style Sheets by making one or more of the red, green and blue components negative or greater than 100%, so the color space is theoretically an unbounded extrapolation of sRGB similar to scRGB.

> https://en.wikipedia.org/wiki/Web_colors

They will just get clipped to the range 0-255. The color specified above will be represented by the browser as:

```javascript
const color = { red: 157, green: 0, blue: 0 }
```

# @fantasy-color/map-color-space-polynomial

Map a color—a three dimensional tuple—from one color space to another, using polynomials of three independent variables to calculate each new value. The coefficients and degree of the polynomials are provided as arguments.

## Usage

To use this function, the first step is to set up the coefficients and the degree of the polynomials.

In this example we are mapping the color from the standard L*a*b* to a variation of that space that was shifted so that all colors are slightly darker (useful for hover effects). The coefficients have been prepared for a polynomial of degree `2`.

```typescript
import { mapColorSpace } from '@fantasy-color/map-color-space-polynomial'

const coeffiecientsToMakeColorDarker = [
  [
    0.0028677056552058413,
    0.0002710888985503337,
    0.00030448981833043544,
    0.0004481466380241387,
    0.00002270969961606002,
    0.0001960549453038932,
    0.6781866204256397,
    -0.02179539063684411,
    -0.019592068432303808,
    1.1601847789138233,
  ],
  [
    -0.002093257907777501,
    0.000006010969931783787,
    -0.0003537230968659505,
    0.001442450208623714,
    0.0005974009953983765,
    -0.00015450114760720183,
    0.2841642502261257,
    0.8527281695672397,
    -0.023466271722765247,
    -8.08223975280506,
  ],
  [
    0.00023226214448834144,
    -0.00008760828343075633,
    -0.0003061844263532397,
    -0.0006035239404938528,
    0.0026425808332845874,
    0.00016252506133674548,
    -0.015621819880352397,
    0.06772075020928792,
    0.7716542598762682,
    -0.06925734380715776,
  ],
]

const mapLabToDarkerLab = (
  coeffiecientsToMakeColorDarker,
  2 // degree of the polynomials
)

mapLabToDarkerLab([60.16969588191749, 93.55002493980824, -60.498555897447304])
// [56.312232697106005, 88.206939784304, -56.340863699838685]
```

> Note that while this example is meant change colors within the "same" color space, given a degree high enough and sufficient coefficients, any color space transformation can be approximated in this way. The other color functions in the `@fantasy-color` library are not using this method under the hood because for those transformations, more efficient functions that do not rely on polynomial approximations are already know.

## Caveats

There is currently no provided way of getting the coefficients from input data. Functions to do that might be provided in the future.

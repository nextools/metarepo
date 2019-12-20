# @fantasy-color

🌈 Color manipulation functions for JavaScript.

### Types

Fantasy Color provides types for the various color formats. These types are used throughout the `@fantasy-color` packages, and they are available in the `@fantasy-color/types` package:

```
yarn add @fantasy-color/types
```

```typescript
type TWithAlpha = {
  alpha: number,
}

type TRgb = {
  red: number,
  green: number,
  blue: number,
}

type TRgba = TRgb & TWithAlpha

type THsv = {
  hue: number,
  saturation: number,
  value: number,
}

type THsva = THsv & TWithAlpha

type THcl = {
  hue: number,
  chroma: number,
  luminance: number,
}

type THcla = THcl & TWithAlpha

type TLab = {
  luminance: number,
  a: number,
  b: number,
}

type TLaba = TLab & TWithAlpha
```

### Contrast Ratio calculations

- [`@fantasy-color/contrast-ratio-luminance`](contrast-ratio-luminance): Calculate the [contrast ratio](#contrast-ratio) of two [relative luminances](#relative-luminance)
- [`@fantasy-color/contrast-ratio-rgb`](contrast-ratio-rgb): Calculate contrast ratio based on RGB input

### Parsing from CSS string

- [`@fantasy-color/from-hex`](from-hex): Parse HEX CSS strings into `RGB` objects
- [`@fantasy-color/from-rgb`](from-rgb): Parse RGB CSS strings into `RGB` objects
- [`@fantasy-color/from-rgba`](from-rgba): Parse RGBA CSS strings into `RGBA` objects

### Type transformations

- [`@fantasy-color/hcl-to-lab`](hcl-to-lab): Transform `HCL` objects to `LAB` objects
- [`@fantasy-color/hcl-to-rgb`](hcl-to-rgb): Transform `HCL` objects to `RGB` objects
- [`@fantasy-color/hsv-to-hsva`](hsv-to-hsva): Transform `HSV` objects to `HSVA` objects
- [`@fantasy-color/hsv-to-rgb`](hsv-to-rgb): Transform `HSV` objects to `RGB` objects
- [`@fantasy-color/hsva-to-hsv`](hsv-to-hsva): Transform `HSVA` objects to `HSV` objects
- [`@fantasy-color/hsva-to-rgba`](hsva-to-rgba): Transform `HSVA` objects to `RGBA` objects
- [`@fantasy-color/lab-to-hcl`](lab-to-hcl): Transform `LAB` objects to `HCL` objects
- [`@fantasy-color/lab-to-rgb`](lab-to-rgb): Transform `LAB` objects to `RGB` objects
- [`@fantasy-color/rgb-to-hcl`](rgb-to-hcl): Transform `RGB` objects to `HCL` objects
- [`@fantasy-color/rgb-to-hsv`](rgb-to-hsv): Transform `RGB` objects to `HSV` objects
- [`@fantasy-color/rgb-to-lab`](rgb-to-lab): Transform `RGB` objects to `LAB` objects
- [`@fantasy-color/rgb-to-rgba`](rgb-to-rgba): Transform `RGB` objects to `RGBA` objects
- [`@fantasy-color/rgb-to-srgb`](rgb-to-srgb): Transform `RGB` objects to sRGB objects (coded in the `RGB` type)
- [`@fantasy-color/rgba-to-hsva`](rgba-to-hsva): Transform `RGBA` objects to `HSVA` objects
- [`@fantasy-color/rgba-to-rgb`](rgba-to-rgb): Transform `RGBA` objects to `RGB` objects

#### Parametrizable color space transformations

- [`@fantasy-color/map-color-space-polynomial`](map-color-space-polynomial): Transform a three-tuple from one color space into another passing the coefficients and degree of the transformation

### Normalization functions

- [`@fantasy-color/normalize-rgb`](normalize-rgb): Transform from `RGB` objects from the 0-255 range to 0-1 decimal points
- [`@fantasy-color/normalize-rgba`](normalize-rgba): Transform from `RGBA` objects from the 0-255 range to 0.1 decimal points

### Relative luminance calculations

- [`@fantasy-color/luminance-for-contrast-ratio`](luminance-for-contrast-ratio): For a given [contrast ratio](#contrast-ratio) and a relative luminance, give a relative luminance that will match this contrast ratio. If the given relative luminance is above 0.5, the returned relative luminance will be lower; if the given relative luminance is below of 0.5, the returned luminance will be higher.
- [`@fantasy-color/luminance-rgb`](luminance-rgb): For a given `RGB` color, return its [relative luminance](#relative-luminance).
- [`@fantasy-color/luminance-srgb`](luminance-srgb): For a given sRGB color (coded as an `RGB` object), return its relative luminance.

## References

This library is to a big extent a partial reimplementation of several other libraries that operate with color and luminosity. The main acknowledgement goes to [`d3-color`](https://github.com/d3/d3-color), from which much of the code has been adapted. The motivation for the partial reimplementation is to deliver the code in a way that each transformation can be requested as an independent, small package, in order to minimize the impact on bundle size.

### Contrast ratio

The contrast ratio calculation is taken from the [WCAG contrast ratio calculation](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef), so this library is useful to automatically check for accessibility compliance.

### Relative luminance

The relative luminance calculation is done based on the [WCAG sRGB relative luminance calculation](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef)

- [Online WCAG contrast ratio calculator](https://snook.ca/technical/colour_contrast/colour.html#fg=FFFFFF,bg=FFFFFF)
- [HCL Color Picker](https://bl.ocks.org/mbostock/3e115519a1b495e0bd95) (based on `d3-color`)

### Why sRGB?

Turns out that sRGB is the color space in which it was specificed the formula for relative luminance used by WCAG for the contrast ratio calculation. https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef

This seems to be a historical accident. sRGB appears to be explicitly deprecated by the w3c https://www.w3.org/Graphics/Color/sRGB.html , raising the question on why would WCAG be specified in a way that makes it actually harder to calculate from the standard CSS RGB.

### Why Lab (CIE L\*a\*b\*) and HCL?

In order to get colors with equivalent hue and saturation but different perceptual luminance, none of the most widespread color spaces (rgb, hsl, hsv) are useful. There is the need for a color space that corrects for brightness by hue.

This is what both [CIE L\*a\*b\*](https://en.wikipedia.org/wiki/CIELAB_color_space) and [HCL](https://en.wikipedia.org/wiki/HCL_color_space) achieve.

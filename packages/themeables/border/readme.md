# @themeables/border

> What is a _themeable_? You can find more in the [`@themeables` readme](..)

Properties that the theme function for the `@themeables/border` should return:

```ts
type TThemeableBorder = {
  color: TColor,
  topLeftRadius?: number,
  topRightRadius?: number,
  bottomRightRadius?: number,
  bottomLeftRadius?: number,
  topWidth?: number,
  rightWidth?: number,
  bottomWidth?: number,
  leftWidth?: number,
  overflowBottom?: number,
  overflowLeft?: number,
  overflowRight?: number,
  overflowTop?: number,
}
```

You can see a full example usage in [the meta file](meta.tsx)

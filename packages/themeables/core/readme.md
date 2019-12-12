# @themeables/background

> What is a _themeable_? You can find more in the [`@themeables` readme](..)

Properties that the theme function for the `@themeables/background` should return:

```ts
type TThemeableBackground = {
  color: TColor,
  topLeftRadius?: number,
  topRightRadius?: number,
  bottomRightRadius?: number,
  bottomLeftRadius?: number,
}
```

You can see a full example usage in [the meta file](meta.tsx)

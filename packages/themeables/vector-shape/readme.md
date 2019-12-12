# @themeables/vector-shape

> What is a _themeable_? You can find more in the [`@themeables` readme](..)

Properties that the theme function for the `@themeables/vector-shape` should return:

```ts
type TThemeableVectorShape = {
  height?: number,
  path: string,
  width?: number,
  color?: TColor,
}
```

On top of that, the themeable VectorShape component receives these props:

```ts
type TVectorShape = {
  id?: string,
  height?: number,
  path: string,
  width?: number,
  color?: TColor,
}
```

You can see a full example usage in [the meta file](meta.tsx)

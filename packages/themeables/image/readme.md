# @themeables/image

> What is a _themeable_? You can find more in the [`@themeables` readme](..)

Properties that the theme function for the `@themeables/image` should return:

```ts
type TThemeableImage = {
  resizeMode?: 'contain' | 'cover',
}
```

On top of that, the themeable image component receives these props:

```ts
type TImage = {
  id?: string,
  alt?: string,
  source: string,
  height: number,
  width: number,
  topLeftRadius?: number,
  topRightRadius?: number,
  bottomRightRadius?: number,
  bottomLeftRadius?: number,
  resizeMode?: 'contain' | 'cover',
  onLoad?: () => void,
  onError?: () => void,
}
```

You can see a full example usage in [the meta file](meta.tsx)

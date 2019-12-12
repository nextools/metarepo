# @themeables/text

> What is a _themeable_? You can find more in the [`@themeables` readme](..)

Properties that the theme function for the `@themeables/text` should return:

```ts
type TThemeableText = {
  color?: TColor,
  fontFamily?: string,
  fontWeight?: TStyle['fontWeight'],
  fontSize?: number,
  lineHeight?: number,
  letterSpacing?: number,
  isUnderlined?: boolean,
}
```

On top of that, the themeable text component receives these props:

```ts
import { TStyle } from 'stili'

type TText = {
  id?: string,
  color?: TColor,
  fontFamily?: string,
  fontWeight?: TStyle['fontWeight'],
  fontSize?: number,
  lineHeight?: number,
  letterSpacing?: number,
  isUnderlined?: boolean,
  shouldPreserveWhitespace?: boolean,
  shouldPreventWrap?: boolean,
  shouldPreventSelection?: boolean,
  shouldHideOverflow?: boolean,
  children: ReactNode,
}
```

You can see a full example usage in [the meta file](meta.tsx)

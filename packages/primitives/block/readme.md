`Block` is a box that holds other components inside. It can be styled to some limited extent. The closest analogs are:

- `div` in Web
- `View` in Native

All the styling options of Block are provided as props instead of as an open-ended `style` object.

```ts
type TBlock = {
  id?: string,
  width?: number,
  height?: number,
  top?: number,
  right?: number,
  bottom?: number,
  left?: number,
  opacity?: number,
  isFloating?: boolean,
  shouldIgnorePointerEvents?: boolean,
  shouldStretch?: boolean,
  children?: ReactNode,
  onPointerEnter?: () => void,
  onPointerLeave?: () => void
}
```


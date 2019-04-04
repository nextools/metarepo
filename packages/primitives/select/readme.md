`Select` is an element that provides a space where the user can select a value from a list of options.

## Option selection handler

- `onChange`: triggered when a different option is selected

## Press handlers

- `onPressIn`: triggered when the component is pressed
- `onPressOut`: triggered when the component is no longer pressed

## Focus-like handlers

- `onFocus`: triggered when the component gets the focus
- `onBlur`: triggered when the component loses the focus

These map to the same corresponding props in Web and in React Native.

## Raw type definitions

```ts
export type TSelectProps = {
  id?: string
  isDisabled?: boolean
  isHidden?: boolean
  color?: string
  family?: string
  weight?: number
  size?: number
  lineHeight?: number
  letterSpacing?: number
  firstNoneSelectableOption?: string
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  shouldStretch?: boolean
  value: string
  zIndex?: number
  onChange: (newValue: string) => void
  onFocus?: () => void
  onBlur?: () => void
  onPressIn?: () => void
  onPressOut?: () => void
}
```

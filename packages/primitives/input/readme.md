`Input` is an element that provides a space where the user can enter text. Only the text properties of it can be styled.

## Editing text handler

- `onChange`:

## Focus-like handlers

- `onFocus`: triggered when the component gets the focus
- `onBlur`: triggered when the component looses the focus

These map to the same corresponding props in Web and in React Native.

## Raw type definitions

```ts
export type TInputProps = {
  id?: string,
  isDisabled?: boolean,
  color?: string,
  family?: string,
  height?: number,
  weight?: number,
  size?: number,
  lineHeight?: number,
  letterSpacing?: number,
  paddingBottom?: number,
  paddingLeft?: number,
  paddingRight?: number,
  paddingTop?: number,
  shouldStretch?: boolean,
  value: string,
  width?: number,
  onChange: (newValue: string) => void,
  onSubmit?: () => void,
  onFocus?: () => void,
  onBlur?: () => void,
}
```


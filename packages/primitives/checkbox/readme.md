`Button` is an element that receives pointer-like interactions. It can't be styled at all: it is designed to simply get out of the way and provide handlers for the interaction in the area covered by its children.

## Hover-like handlers

- `onPointerEnter`: triggered when the pointer goes above the area of the component
- `onPointerLeave`: triggered when the pointer goes out of the area of the component

These map to Web only:

- `onPointerEnter` -> `onMouseEnter`
- `onPointerLeave` -> `onMouseLeave`

React Native does not currently support hover-like actions.

## Press-like handlers

- `onToggle`: triggered when a complete press action is done on the component
- `onPressIn`: triggered when the component is being pressed
- `onPressOut`: triggered when the component stops being pressed

In Web:

- `onToggle` -> `onClick`
- `onPressIn` -> `onMouseDown`
- `onPressOut` -> `onMouseUp`

In Native:

- `onToggle` -> `onValueChange`
- `onPressIn` -> `onPressIn`
- `onPressOut` -> `onPressOut`

## Focus-like handlers

- `onFocus`: triggered when the component gets the focus
- `onBlur`: triggered when the component looses the focus

These map to Web only:

- `onFocus` -> `onFocus`
- `onBlur` -> `onBlur`

React Native does not currently support focus-like actions on Touchable components.

## Raw type definitions

```ts
export type TIsHoveredHandlers = {
  onPointerEnter?: () => void,
  onPointerLeave?: () => void
}

export type TIsPressedHandlers = {
  onPressIn?: () => void,
  onPressOut?: () => void
}

export type TIsFocusedHandlers = {
  onFocus?: () => void
  onBlur?: () => void
}

export type TButtonProps = {
  id?: string,
  accessibilityLabel?: string,
  isDisabled?: boolean,
  shouldStretch?: boolean,
  onToggle?: () => void
} & TIsHoveredHandlers & TIsPressedHandlers & TIsFocusedHandlers
```


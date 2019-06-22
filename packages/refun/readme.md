# refun

A collection of React Hook-enabled functions that compose harmoniously with each other. Similar to `recompose`, but:

- Uses `Props -> Props` functions instead of `Component -> Component` functions (and no wrapper is added)
- Propagates TypeScript types through the composition chain **without any losses**
- Works entirely with Hooks instead of class components

## Usage example

```ts
import { component, startWithType, mapWithPropsMemo } from 'refun'

export const Button = component(
  startWithType<TButtonProps>(),
  mapWithPropsMemo(({ isDisabled }) => ({
    styles: normalizeStyle({
      appearance: 'none',
      background: 'none',
      border: 0,
      cursor: isDisabled ? 'auto' : 'pointer',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      alignSelf: 'stretch',
      flexGrow: 1,
      flexShrink: 1,
      minWidth: 0,
      margin: 0,
      outline: 0,
      padding: 0,
      tapHighlightColor: 'rgba(255, 255, 255, 0)',
      userSelect: 'none',
    }),
  }), ['isDisabled'])
)(({
  id,
  accessibilityLabel,
  isDisabled,
  styles,
  onPointerEnter,
  onPointerLeave,
  onPress,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
  children,
}) => (
  <button
    aria-label={accessibilityLabel}
    disabled={isDisabled}
    id={id}
    onClick={onPress}
    onMouseEnter={onPointerEnter}
    onMouseLeave={onPointerLeave}
    onMouseDown={onPressIn}
    onMouseUp={onPressOut}
    onFocus={onFocus}
    onBlur={onBlur}
    style={styles}
  >
    {children}
  </button>
))
```

Several things to note:

- [`component`](#component) is used instead of a regular `compose` (from Ramda, Recompose or Redux for example) because `component` accurately propagates the types throughout the entire chain
- Because of the type propagation, it's convenient to write down all the functions in place in the composition chaing. This way, the types will be inferred: otherwise the types will have to be specified manually.
- [`startWithType`](#startWithType) is used as the first function of the chain so that the type to be used by the generics throughout the composition chain is available. This shouldn't be necessary: ideally, the `component` function itself should be able to propagate the type variable of the generic down to the functions inside, but at the time of this writing (2019-06-21) TypeScript does not support this. If it would, then the right way to start the composition chain would be:

  ```ts
  export const Button = component<TButtonProps>(
    mapWithPropsMemo(({ isDisabled }) => ({
    ...
  ```

  …skipping the `startWithType` function.


## `component`

This function is an analog of `compose` and it performs simple function composition with two caveats:

- The value sent into the chain is presumed to be a React Function Component (`FC` type)
- `component` will use the output type of one function in the chain as the input type of the next function in the chain, allowing the functions to modify the type along the way. It is not necessary to tell `component` what the output type at the end of the chain is going to be, since it will be inferred correctly from the functions passed into it.

## `mapContext`

This function receives a React Context object as created by the `React.createContext` function. The assumption is that the `value` property inside the Context is an object: `mapContext` will spread that object into the props of the components.

For example:

```ts
import React, { createContext } from 'react'
import { component, mapContext, startWithType } from 'refun'

type TThemeContext = {
  darkMode: boolean,
}

const ThemeContext = createContext<TThemeContext>({
  darkMode: false
})

type TMessage = {
  label: string
}

component(
  startWithType<TMessage>(),
  mapContext(ThemeContext)
)(({ darkMode, label }) => (
  <p style={{ color: darkMode ? 'white' : 'black' }}>
    {label}
  </p>
))
```

## `mapDebouncedHandlers`

**TODO** (no clue)

## `mapDefaultProps`

This function sets some default prop values based on the object that is passed into it. Alternative to using the static `defaultProps` component property. The advantage of using it is that the props passed in will be type checked.

```ts
import React from 'react'
import { component, mapDefaultProps, startWithType } from 'refun'

type TMessage = {
  label: string
}

export default component(
  startWithType<TMessage>(),
  mapDefaultProps({
    label: 'Hello World!'
  })
)(({ label }) => (
  <p>{label}</p>
))
```

## `mapFocused`

This function sets properties when the `onFocus` handler is called and removes them when `onBlur` is called.

```ts
import React from 'react'
import { component, mapFocused, startWithType } from 'refun'

type TButton = {
  label: string,
}

export default component(
  startWithType<TButton>(),
  mapFocused({
    isFocused: true,
  })
)(({ isFocused, label, onBlur, onFocus }) = (
  <button
    onBlur={onBlur}
    onFocus={onFocus}
    style={{
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: isFocused ? 'black' : 'grey'
    }}>
    {label}
  </button>
))
```

## `mapHovered`

This function sets properties when the `onPointerEnter` handler is called and removes them when `onPointerLeave` is called.

Note that `onPointerEnter` and `onPointerLeave` are synthetic event names meant to abstract from platform specific hover states. In web, they will be typically mapped:

- `onPointerEnter` -> `onMouseEnter`
- `onPointerLeave` -> `onMouseLeave`

…and each platform will have their own corresponding mapping.

```ts
import React from 'react'
import { component, mapHovered, startWithType } from 'refun'

type TButton = {
  label: string,
}

export default component(
  startWithType<TButton>(),
  mapHovered({
    isHovered: true,
  })
)(({ isHovered, label, onPointerEnter, onPointerLeave }) = (
  <button
    onMouseEnter={onPointerEnter}
    onMouseLeave={onPointerLeave}
    style={{
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: isHovered ? 'black' : 'grey'
    }}>
    {label}
  </button>
))
```

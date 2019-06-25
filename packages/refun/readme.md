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

This function sets the `isFocused` prop to `true` when the `onFocus` handler is called and to `false` when `onBlur` is called.

```ts
import React from 'react'
import { component, mapFocused, startWithType } from 'refun'

type TButton = {
  label: string,
}

export default component(
  startWithType<TButton>(),
  mapFocused
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

## `mapHandlers`

**TODO**

## `mapHovered`

This function sets the `isHovered` prop to `true` when the `onPointerEnter` handler is called and to `false` when `onPointerLeave` is called.

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
  mapHovered
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

## `mapKeyboardFocused`

This function sets the `isKeyboardFocused` prop to `true` when the target gets focused (after `onFocus`) but only if the focus was acquired via the keyboard interaction, not a pointer event (so if there was no press event before the `onFocus`). The prop is set to `false` once `onBlur` happens.

The reason this is useful is that it allows focus states meant for keyboard navigation to be differentiated from regular focus states. When the user is navigating with the keyboard, for example pressing the Tab key, visual highlighting of the focused elements needs to be more prominent to guide the sight into where the active element is. Pointer events will trigger focus as well, but when the interaction was initiated with a pointer it's not necessary for the highlight to be as prominent, since the user is already focused in the pointer position. In order to distinguish these two states and make it possible to style them separately, you can use `mapFocused` for the general case and `mapKeyboaredFocused` for the specific keyboard navigation case.

Note that `onPressIn` and `onPointerLeave` are synthetic event names meant to abstract from platform specific hover states. In web, they will be typically mapped:

- `onPressIn` -> `onMouseDown`
- `onPressOut` -> `onMouseUp`

…and each platform will have their own corresponding mapping.

```ts
import React from 'react'
import { component, mapKeyboardFocused, startWithType } from 'refun'

type TButton = {
  label: string,
}

export default component(
  startWithType<TButton>(),
  mapKeyboardFocused
)(({ isHovered, label, onBlur, onFocus, onPressIn, onPressOut }) = (
  <button
    onBlur={onBlur}
    onFocus={onFocus}
    onMouseDown={onPressIn}
    onMouseUp={onPressOut}
    style={{
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: isHovered ? 'black' : 'grey'
    }}>
    {label}
  </button>
))
```

## `mapPressed`

This function sets the `isPressed` prop to `true` when the `onPressIn` handler is called and to `false` when `onPressOut` is called.

Note that `onPressIn` and `onPressOut` are synthetic event names meant to abstract from platform specific pressed states. In web, they will be typically mapped:

- `onPressIn` -> `onMouseDown`
- `onPressOut` -> `onMouseUp`

…and each platform will have their own corresponding mapping.

```ts
import React from 'react'
import { component, mapPressed, startWithType } from 'refun'

type TButton = {
  label: string,
}

export default component(
  startWithType<TButton>(),
  mapPressed
)(({ isPressed, label, onPressIn, onPressOut }) = (
  <button
    onMouseDown={onPressIn}
    onMouseUp={onPressOut}
    style={{
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: isPressed ? 'black' : 'grey'
    }}>
    {label}
  </button>
))
```

## `mapProps`

This function takes a handler that receives all props and returns new props.

```ts
import React from 'react'
import { component, mapProps, startWithType } from 'refun'

type TButton = {
  label: string,
}

export default component(
  startWithType<TButton>(),
  mapProps(({ label }) => ({ children }))
)(({ children }) = (
  <button>
    {children}
  </button>
))
```

## `mapReducer`

This function takes a reducer and an initial state factory, and passes down the `state` (spreaded as props) and the `dispatch` function. It employs the `useReducer` hook under the hood.

```ts
import React from 'react'
import { component, mapReducer, startWithType } from 'refun'

type TCounter = {
  initialCounter: number,
}

export default component(
  startWithType<TCounter>(),
  mapReducer(
    (state, action) => {
      switch (action.type) {
        case 'ADD':
          return {
            counter: state.counter + 1
          }

        default:
          return state
      }
    },
    ({ initialCounter }) => ({
      counter: initialCounter
    })
  )
)(({ counter, dispatch }) = (
  <div>
    <button onClick={() => dispatch({ type: 'ADD' })}>
      Add
    </button>
    <span>
      {counter}
    </span>
  </div>
))
```

## `mapRedux`

**TODO** (no clue)

## `mapRefLayout`

**TODO**

## `mapRef`

**TODO**

## `mapSafeRequestAnimationFrame` & `mapSafeRequestAnimationFrameFactory`

**TODO**

## `mapSafeTimeout` & `mapSafeTimeoutFactory`

**TODO**

## `mapState`

**TODO**

## `mapThrottledHandler` & `mapThrottledHandlerFactory`

**TODO**

## `mapWithAsyncProps`

**TODO**

## `onMount`

This function calls the passed in callback when the component is first mounted, sending the current Props as argument.

For example:

```ts
import React from 'react'
import { component, onMount, startWithType } from 'refun'

type TButton = {
  label: string,
}

export default component(
  startWithType<TButton>(),
  onMount(({ label }) => console.log('Mounted with label', label))
)(({ label }) = (
  <button>
    {label}
  </button>
))
```

# refun

A collection of React Hook-enabled functions that compose harmoniously with each other. Similar to `recompose`, but:

- Uses `Props -> Props` functions instead of `Component -> Component` functions. This is all around better. It means:
  - Less nodes in the React tree
  - Better optimization options for the JavaScript engine
  - Being able to reuse general purpose functions (all of Ramda's object manipulation functions work)
- Propagates TypeScript types through the composition chain **without any losses**.
- Works entirely with React Hooks instead of class components

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
- Because of the type propagation, it's convenient to write down all the functions in place in the composition chain. This way, the types will be inferred: otherwise the types will have to be specified manually.
- [`startWithType`](#startWithType) is necessary because of a TypeScript shortcoming. It is used to make the type that will be received by the first function in the composition chain available. It shouldn't be necessary to do this with a specific function: ideally, the `component` function itself should be able to propagate the type variable of the generic down to the functions inside, but at the time of this writing (2019-06-26) TypeScript does not support this. If it would, the right way to start the composition chain would be:

  ```ts
  // Note: This is currently not possible
  export const Button = component<TButtonProps>(
    mapWithPropsMemo(({ isDisabled }) => ({
    ...
  ```

## `component`

This function is an analog of `compose` and it performs simple function composition, with two caveats:

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

- debounce: cancels previous one (resets timer)
- throttle: changes the arguments but preserves timeout

## `mapDebouncedHandlerTimeout`

This function allows you to defer the execution of a handler for a grace period (specified in milliseconds) and if the handler gets invoked again during that period, it cancels the current grace period and overrides it with the new call, restarting the time counter.

Why you ask? Imagine for example that there is a button in the UI in which a user might be tempted to repeatedly click to make sure an action happens, but it doing so they will repeatedly trigger an expensive operation that will freeze the application. To avoid this, you could debounce the `onClick` handler for some milliseconds and make sure only the last call will be acted upon.

```ts
import * as React from "react"
import { component, mapHandlers, mapDebouncedHandlerTimeout, startWithType } from "refun"

type TButton = {
  onClick: () => void
}

export default component(
  startWithType<TButton>(),
  mapHandlers({
    onClick: () => () => console.log("the handler was now called")
  }),
  mapDebouncedHandlerTimeout("onClick", 1000)
)(({ onClick }) => (
  <div>
    <p>
      Even if you click the button many times in a row (with each click less
      than a second after the other), you will only see one log message, at the
      end
    </p>
    <button onClick={onClick}>Click me</button>
  </div>
))
```

[📺 Check out live demo](https://codesandbox.io/s/refun-mapdebouncedhandlertimeout-791kn)

## `mapDebouncedHandlerFactory`

This function is a constructor for debouncers. It is used under the hood to build the `mapDebouncedHandlerTimeout` function. If you have a function that creates a deferred effect and a function that will cancel that deferral, you can build your own debouncer.

This is how `mapDebouncedHandlerTimeout` is defined:

```ts
export const mapDebouncedHandlerTimeout = mapDebouncedHandlerFactory(setTimeout, clearTimeout)
```

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
import * as React from 'react'
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

This function allows you to build custom handlers that will be memoized so that they do not cause a diff in the shallow comparison, which would lead to a re render.

So instead of writing:

```ts
// This will cause the component to re render every time because the handler is unique in every execution
const Input = ({ onChange, value }) => {
  const handleChange = ({ target: { value } }) => onChange(value)

  return <input
    onChange={handleChange}
    value={value}
  />
}
```

…it allows you to do:

```ts
import * as React from 'react'
import { component, mapHandlers, startWithType } from 'refun'

type TInput = {
  onChange: (string) => void,
  value: string,
}

export default component(
  startWithType<TInput>(),
  mapHandlers({
    onChange: ({ onChange }) => ({ target: { value } }) => onChange(value),
  })
)(
  ({ onChange, value }) => (
    <input
      onChange={onChange}
      value={value}
    />
  )
)
```

The first argument that each handler will receive is the current props, and the second is the arguments that had been sent to the handler. Notice that the second argument is curried.

[📺 Check out live demo](https://codesandbox.io/s/refun-maphandlers-8d823)

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

Note that `label` is no longer available as a prop to the component. If you want to expand the props with extra ones instead of replacing them consider using [`mapWithProps`](#mapWithProps)

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

This function allows you to capture the `ref` to a DOM element, and synchronously perform an update of the props based on some values of the element. It relies on `useLayoutEffect` under the hoods to synchronously capturing the `ref` and then updates the state, which will cause React to cancel the previous render and use the updated one instead.

This is particularly useful in order to measure a component’s size and update the rendering without causing any flickering.

`mapRefLayout` receives three arguments:

1. The name of the prop that will hold the `ref`
2. A handler that receives the `ref` and the props as arguments, and returns a set of props to be added to the incoming props.
3. A list of names of incoming props to be monitored. If one of those props changes, the handler should be executed again. Otherwise it will be skipped. See [`mapWithPropsMemo`](#mapWithPropsMemo) for a similar API.

```ts
import * as React from "react"
import { component, mapRefLayout, startWithType } from "refun"

type TLayout = {
  direction: "horizontal" | "vertical"
}

const Button = component(
  startWithType<TLayout>(),
  mapRefLayout(
    "buttonElementRef",
    (buttonElementRef, { direction }): { size: number } => {
      if (buttonElementRef) {
        switch (direction) {
          case "horizontal":
            return {
              size: buttonElementRef.getBoundingClientRect().width
            }
          case "vertical":
            return {
              size: buttonElementRef.getBoundingClientRect().height
            }
        }
      }

      return {
        size: 10
      }
    },
    ["direction"]
  )
)(({ buttonElementRef, size }) => <button ref={buttonElementRef}>{size}</button>)
```

[📺 Check out live demo](https://codesandbox.io/s/refun-mapreflayout-ve3zn)

## `mapRef`

This function provides a way of making a mutable reference available as a prop. It uses the `useRef` hook under the hood.

Refs are useful to store derived values that do not support shallow comparison, such as functions, or DOM elements.

For example you can use it to capture the `ref` to a DOM element and inspect it:

```ts
import React from 'react'
import { component, mapRef, onMount, startWithType } from 'refun'

type TButton = {
  label: string
}

export default component(
  startWithType<TButton>(),
  mapRef('buttonElementRef', null),
  onMount(({ buttonElementRef }) => {
    if (buttonElementRef.current !== null) {
      console.log(buttonElementRef)
    }
  })
)(
  ({ buttonElementRef, label }) => (
    <button ref={buttonElementRef}>
      {label}
    </button>
  )
)
```

[📺 Check out live demo](https://codesandbox.io/s/refun-mapref-t3wog)

## `mapSafeRequestAnimationFrame` & `mapSafeRequestAnimationFrameFactory`

**TODO**

## `mapSafeTimeout` & `mapSafeTimeoutFactory`

**TODO**

## `mapState`

This function allows you to set up a stateful prop and a function for updating that prop. It also supports setting the initial value, derived from the props passed into it, and a list of props to watch to reset that value whenever the external prop changes.

Note in the example how the `OverridableInternalCounter` sets the `["counter"]` as the last argument of `mapState`. This will cause `mapState` to watch for incoming changes to the `counter` prop and use them to update the `internalCounter` prop, accordingly to the function in the third argument `({ counter }) => counter`. In the case of `InternalCounter`, the array in the last argument is empty (`[]`) and then `mapState` does not watch for changes, which causes the external prop `counter` value to be ignored once updated, effectively working as an initial value only for `internalCounter`.

```ts
import * as React from "react"
import { component, mapState, startWithType } from "refun"

type TCounter = {
  counter: number
}

const InternalCounter = component(
  startWithType<TCounter>(),
  mapState("internalCounter", "setCounter", ({ counter }) => counter, [])
)(({ internalCounter, setCounter }) => (
  <div>
    <button onClick={() => setCounter(internalCounter + 1)}>
      Add to internal counter
    </button>
    <p>{internalCounter}</p>
  </div>
));

const OverridableInternalCounter = component(
  startWithType<TCounter>(),
  mapState("internalCounter", "setCounter", ({ counter }) => counter, [
    "counter"
  ])
)(({ internalCounter, setCounter }) => (
  <div>
    <button onClick={() => setCounter(internalCounter + 1)}>
      Add to overridable internal counter
    </button>
    <p>{internalCounter}</p>
  </div>
));

export default component(
  startWithType<TCounter>(),
  mapState("externalCounter", "setExternalCounter", ({ counter }) => counter, [
    "counter"
  ])
)(({ externalCounter, setExternalCounter }) => (
  <div>
    <button onClick={() => setExternalCounter(externalCounter + 1)}>
      Add to external counter
    </button>
    <p>{externalCounter}</p>
    <OverridableInternalCounter counter={externalCounter} />
    <InternalCounter counter={externalCounter} />
  </div>
))
```

[📺 Check out live demo](https://codesandbox.io/s/refun-mapstate-zy1rj)

## `mapThrottledHandler` & `mapThrottledHandlerFactory`

**TODO**

## `mapWithAsyncProps`

This function is exactly like [`mapWithPropsMemo`](#mapWithPropsMemo), except that the mapper function is expected to return a Promise that will resolve with the props to add.

```ts
import * as React from "react";
import { render } from "react-dom";
import { component, mapWithAsyncProps, startWithType } from "refun";
import axios from "axios";

type TPokemon = {
  id: string;
};

const Pokemon = component(
  startWithType<TPokemon>(),
  mapWithAsyncProps(
    async ({ id }) => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        return {
          height: response.data.height,
          weight: response.data.weight
        };
      } catch {
        return {
          height: undefined,
          weight: undefined
        };
      }
    },
    ["id"]
  )
)(({ id, height, weight }) => (
  <p>
    {id} is {height} height and weights {weight}
  </p>
));

export default () => <Pokemon id="pikachu" />
```

[📺 Check out live demo](https://codesandbox.io/s/refun-mapwithasyncprops-ty9l6)

## `mapWithProps`

This function allows you to expand the props passed in to a component with more props derived from them. It is typically used to precalculate values that are to be used in the component, to minimize the amount of logic needed to do in the render.

If the returned props have the same name as incoming props, they will override the incoming props.

```ts
import React from 'react'
import { component, mapFocused, startWithType } from 'refun'

type TButton = {
  label: string,
}

export default component(
  startWithType<TButton>(),
  mapFocused,
  mapWithProps(({ isFocused }) => ({
    borderColor: isFocused ? 'black' : 'grey'
  }))
)(({ borderColor, label, onBlur, onFocus }) = (
  <button
    onBlur={onBlur}
    onFocus={onFocus}
    style={{
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor
    }}>
    {label}
  </button>
))
```

Note that this function just adds props to the component. If you want to replace all of them, you can use [`mapProps`](#mapProps) instead.

## `mapWithPropsMemo`

This function does the same as [`mapWithProps`](#mapWithProps) and it memoizes the result for the props specified in the second parameter.

An example use case in which this can prove useful is if you were to be calculating the Fibonacci number of an input, which is known to be expensive for large numbers:

```ts
import React from 'react'
import { component, mapWithPropsMemo, startWithType } from 'refun'
import calculateFibonacci from './calculateFibonacci'

type TFibonacci = {
  position: number,
}

export default component(
  startWithType<TFibonacci>(),
  mapWithPropsMemo(({ position }) => ({
    fibonacci: calculateFibonacci(position)
  }), ['position'])
)(({ position, fibonacci }) = (
  <p>
    The Fibonacci numbers in position {position} is <mark>{fibonacci}</mark>
  </p>
))
```

Notice that `mapWithPropsMemo` takes two arguments, and that memoization happens for the props that are specified in the second argument, in this case `position`.

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

## `pureComponent`

This function is identical to [`component`](#component) except that it memoizes the React element that results from rendering with a certain set of props. The props that are memoized are the _inner_ props, that is, the props that the component will get as the result of the entire composition chain. These are different from the _outer_ props, that are the ones that consumers pass manually into the component.

The purpose of this component is to prevent a re render from happening when the React tree is known to be the same. It is particularly useful when the React tree is a complex one, since the cost grows fast with the amount of nodes in the tree. Since the memoization is done in the inside of the component, all `map` functions will be run, making it ideal for components that control their own state.

> Note that this function is meant to be used to avoid pointless re renders of complex trees, which is a concern that should be treated at the high level, in an app for example, rather than in small presentational components. Memoization comes with a cost, and React is already providing optimizations via reconciliation, so the type of optimizations that `pureComponent` does, similar to the old `shouldComponentUpdate`, is to be reserved for cases where there is a clear need for optimization.

```ts
import React from 'react'
import { mapReducer, pureComponent, startWithType } from 'refun'
import AComplexHeader from './AComplexHeader'
import AnExpensiveToComputeSidebar from './AnExpensiveToComputeSidebar'

type TCounter = {
  initialCount: number,
}

export default pureComponent(
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
  <main>
    <AComplexHeader />
    <AnExpensiveToComputeSidebar />
    <button>
      Add
    </button>

    <p>{counter}</p>
  </main>
))
```

So to be clear, the component that receives `counter` and `dispatch` as props is the one that is going to be memoized. If your intention is to memoize an expensive computation in a function in the composition chain, such as calculating a value in the `mapWithProps`, take a look at [`mapWithPropsMemo`](#mapWithPropsMemo) instead.

`pureComponent` should only be used in components that receive no `children` and no complex props, since otherwise the overhead of memoization is not worth it. If the component receives `children` or complex props (objects / arrays), `pureComponent` will not provide any benefit, since those are very likely (or guaranteed in the case of `children`) to be different on every render. `pureComponent` works by doing a shallow comparison of the current props with the previous props. Shallow comparison means that each prop is compared with hard equality with the previous value of that same props.

## `startWithType`

This function is simply a way of setting up the initial type in the [`component`](#component) composition chain, since TypeScript does not currently support doing that in the composition function itself (`component` in this case, but would be `compose` in Redux, Ramda, etc).

It's purpose is entirely for types, and in runtime it's a no-op.

```ts
import React from 'react'
import { component, startWithType } from 'refun'

type TButton = {
  label: string,
}

export default component(
  startWithType<TButton>(),
)(({ label }) = (
  <button>
    {label}
  </button>
))
```

Once this is fixed in TypeScript this function will be redundant and it will be possible to pass the generic directly into `component`:


```ts
import React from 'react'
import { component } from 'refun'

type TButton = {
  label: string,
}

// Remember: this is currently *not* supported
export default component<TButton>(
  (props) => props
)(({ label }) = (
  <button>
    {label}
  </button>
))
```

…meanwhile `startWithType` is a straightforward workaround.

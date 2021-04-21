# refun ![npm](https://flat.badgen.net/npm/v/refun)

A collection of React Hook-enabled functions that compose harmoniously with each other. Similar to `recompose`, but:

- Uses `Props -> Props` functions instead of `Component -> Component` functions. This is all around better. It means:
  - Less nodes in the React tree
  - Better optimization options for the JavaScript engine
  - Being able to reuse general purpose functions (all of Ramda's object manipulation functions work)
- Propagates TypeScript types through the composition chain **without any losses**.
- Works entirely with React Hooks instead of class components

## Usage example (with TypeScript)

```tsx
import {
  component,
  mapDefaultProps,
  mapHandlers,
  mapHovered,
  mapState,
  mapWithPropsMemo,
  startWithType,
  TMapHovered
} from 'refun'

type TButton = {
  isDisabled?: boolean
  clickCounter?: number
  id?: string
} & TMapHovered

export const Button = component(
  startWithType<TButton>(),
  mapDefaultProps({
    clickCounter: 0,
    isDisabled: false
  }),
  mapState(
    "clickCounter",
    "setClickCounter",
    ({ clickCounter }) => clickCounter,
    ["clickCounter"]
  ),
  mapHandlers({
    onClick: ({ clickCounter, setClickCounter }) => () =>
      setClickCounter(clickCounter + 1)
  }),
  mapHovered,
  mapWithPropsMemo(
    ({ clickCounter, isDisabled, isHovered }) => ({
      children: `Click count: ${clickCounter}`,
      style: {
        cursor: isDisabled ? "auto" : "pointer",
        borderColor: isHovered ? "black" : "grey"
      }
    }),
    ["clickCounter", "isDisabled", "isHovered"]
  )
)(
  ({
    id,
    isDisabled,
    style,
    onPointerEnter,
    onPointerLeave,
    onClick,
    children
  }) => (
    <button
      disabled={isDisabled}
      id={id}
      onClick={onClick}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
      style={style}
    >
      {children}
    </button>
  )
)
```

[📺 Check out live demo](https://codesandbox.io/s/refun-example-nec8y)

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

> Note: you might notice that `refun` has functions that serve as the equivalent of most of the React Hooks, so it might seem odd that some, such as `useEffect`, are missing. The reason is simply that wrapping them in the composition chain of `refun` provides no benefit: `useEffect` in particular does not result in any prop being added or removed, and there is no implicit state to keep track of, as is the case with the `mapSafeTimeout` and similar functions.

> It is not the goal of `refun` to be a replacement of direct usage of React Hooks, rather a way to use them as a clean and decoupled composition chain and with good TypeScript typings, features that are only relevant to certain Hooks.

## API

- [component](#component)
- [pureComponent](#pureComponent)
- [mapContext](#mapContext)
- [mapDebouncedHandlerTimeout](#mapDebouncedHandlerTimeout)
- [mapDebouncedHandlerFactory](#mapDebouncedHandlerFactory)
- [mapDefaultProps](#mapDefaultProps)
- [mapFocused](#mapFocused)
- [mapHandlers](#mapHandlers)
- [mapHovered](#mapHovered)
- [mapKeyboardFocused](#mapKeyboardFocused)
- [mapPressed](#mapPressed)
- [mapProps](#mapProps)
- [mapRef](#mapRef)
- [mapSafeRequestAnimationFrame](#mapSafeRequestAnimationFrame)
- [mapSafeTimeout](#mapSafeTimeout)
- [mapState](#mapState)
- [mapStateRef](#mapStateRef)
- [mapThrottledHandlerTimeout](#mapThrottledHandlerTimeout)
- [mapThrottledHandlerAnimationFrame](#mapThrottledHandlerAnimationFrame)
- [mapThrottledHandlerFactory](#mapThrottledHandlerFactory)
- [mapWithProps](#mapWithProps)
- [mapWithPropsMemo](#mapWithPropsMemo)
- [onChange](#onChange)
- [onLayout](#onLayout)
- [onUpdate](#onUpdate)
- [onUpdateAsync](#onUpdateAsync)
- [startWithType](#startWithType)
- [StoreContextFactory](#StoreContextFactory)

## `component`

This function is an analog of `compose` and it performs simple function composition, with two caveats:

- The value sent into the chain is presumed to be a React Function Component (`FC` type)
- `component` will use the output type of one function in the chain as the input type of the next function in the chain, allowing the functions to modify the type along the way. It is not necessary to tell `component` what the output type at the end of the chain is going to be, since it will be inferred correctly from the functions passed into it.

## `pureComponent`

This function is identical to [`component`](#component) except that it memoizes the React element that results from rendering with a certain set of props. The props that are memoized are the _inner_ props, that is, the props that the component will get as the result of the entire composition chain. These are different from the _outer_ props, that are the ones that consumers pass manually into the component.

The purpose of this component is to prevent a re-render from happening when the React tree is known to be the same. It is particularly useful when the React tree is a complex one, since the cost grows fast with the amount of nodes in the tree. Since the memoization is done in the inside of the component, all `map` functions will be run, making it ideal for components that control their own state.

> Note that this function is meant to be used to avoid pointless re renders of complex trees, which is a concern that should be treated at the high level, in an app for example, rather than in small presentational components. Memoization comes with a cost, and React is already providing optimizations via reconciliation, so the type of optimizations that `pureComponent` does, similar to the old `shouldComponentUpdate`, is to be reserved for cases where there is a clear need for optimization.

```tsx
import { mapReducer, pureComponent, startWithType } from 'refun'
import AComplexHeader from './AComplexHeader'
import AnExpensiveToComputeSidebar from './AnExpensiveToComputeSidebar'

type TCounter = {
  initialCount?: number,
}

export default pureComponent(
  startWithType<TCounter>(),
  mapDefaultProps({
    initialCount: 0
  }),
  mapState('counter', 'setCounter', ({ initialCount }) => initialCount, ['initialCount']),
  mapHandlers
)(({ counter, dispatch }) = (
  <main>
    <AComplexHeader />
    <AnExpensiveToComputeSidebar />
    <button onClick>
      Add
    </button>

    <p>{counter}</p>
  </main>
))
```

So to be clear, the component that receives `counter` and `dispatch` as props is the one that is going to be memoized. If your intention is to memoize an expensive computation in a function in the composition chain, such as calculating a value in the `mapWithProps`, take a look at [`mapWithPropsMemo`](#mapWithPropsMemo) instead.

`pureComponent` should only be used in components that receive no `children` and no complex props, since otherwise the overhead of memoization is not worth it. If the component receives `children` or complex props (objects / arrays), `pureComponent` will not provide any benefit, since those are very likely (or guaranteed in the case of `children`) to be different on every render. `pureComponent` works by doing a shallow comparison of the current props with the previous props. Shallow comparison means that each prop is compared with hard equality with the previous value of that same props.

## `mapContext`

Signature:

```ts
const mapContext: <T>(context: React.Context<T>) => // ...
```

This function receives a React Context object as created by the `React.createContext` function. The assumption is that the `value` property inside the Context is an object: `mapContext` will spread that object into the props of the components.

For example:

```tsx
import { createContext } from 'react'
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

[📺 Check out live demo](https://codesandbox.io/s/refun-mapcontext-rtjvk)

## `mapDebouncedHandlerTimeout`

Signature:

```ts
const mapDebouncedHandlerTimeout: (handlerName: string, timeout: number) => // ...
```

> This function is affected by the [React Synthetic Events vs debouncing / throttling](#react-synthetic-events-vs-debouncing--throttling) issue.

This function allows you to defer the execution of a handler for a grace period (specified in milliseconds) and if the handler gets invoked again during that period, it cancels the current grace period and overrides it with the new call, restarting the time counter.

Why you ask? Imagine for example that there is a button in the UI in which a user might be tempted to repeatedly click to make sure an action happens, but it doing so they will repeatedly trigger an expensive operation that will freeze the application. To avoid this, you could debounce the `onClick` handler for some milliseconds and make sure only the last call will be acted upon.

The difference between debouncing and throttling (available in [`mapThrottledHandlerTimeout`](#mapThrottledHandlerTimeout)) is that successive calls to a debounced handler will restart the timeout each time, while throttled calls will be executed once the initially set timeout it reached, using the latest arguments. Following the FRP convention, this is how debouncing could be represented:

```
debouncing in 3 seconds

          1s 2s 3s 4s 5s 6s 7s 8s 9s
received  x--y--------z------------
ran       ---------y--------z------
```

Notice how the timeout initially set for `x` is simply cancelled and overridden with a new timeout of 3 seconds for `y`.

```tsx
import { component, mapHandlers, mapDebouncedHandlerTimeout, startWithType } from 'refun'

type TButton = {
  onClick: () => void
}

export default component(
  startWithType<TButton>(),
  mapHandlers({
    onClick: () => () => console.log("the handler was now called")
  }),
  mapDebouncedHandlerTimeout('onClick', 1000)
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

Signature:

```ts
const mapDebouncedHandlerFactory: (setFn: Function, clearFn: Function) => (handlerName: string, ...setFnArgs: any[]) => // ...
```

> All the functions create with this one are affected by the [React Synthetic Events vs debouncing / throttling](#react-synthetic-events-vs-debouncing--throttling) issue.

This function is a constructor for debouncers. It is used under the hood to build the `mapDebouncedHandlerTimeout` function. If you have a function that creates a deferred effect and a function that will cancel that deferral, you can build your own debouncer.

This is how `mapDebouncedHandlerTimeout` is defined:

```ts
export const mapDebouncedHandlerTimeout = mapDebouncedHandlerFactory(setTimeout, clearTimeout)
```

## `mapDefaultProps`

Signature:

```ts
const mapDefaultProps: <P>(defaultProps: P) => // ...
```

This function sets some default prop values based on the object that is passed into it. Alternative to using the static `defaultProps` component property. The advantage of using it is that the props passed in will be type checked.

```tsx
import { component, mapDefaultProps, startWithType } from 'refun'

type TMessage = {
  label?: string
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

[📺 Check out live demo](https://codesandbox.io/s/refun-mapdefaultprops-gqjqz)

## `mapFocused`

Signature: Not callable.

This function sets the `isFocused` prop to `true` when the `onFocus` handler is called and to `false` when `onBlur` is called.

```tsx
import { component, mapFocused, startWithType, TMapFocused } from 'refun'

type TButton = {
  label: string
} & TMapFocused

export default component(
  startWithType<TButton>(),
  mapFocused
)(
  ({ isFocused, label, onBlur, onFocus }) => (
    <button
      onBlur={onBlur}
      onFocus={onFocus}
      style={{
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: isFocused ? "red" : "grey",
        outline: "none"
      }}
    >
      {label}
    </button>
  )
)
```

[📺 Check out live demo](https://codesandbox.io/s/refun-mapfocused-8gls5)

## `mapHandlers`

Signature:

```ts
const mapHandlers: <P>(handlers: { [key: string]: (props: P) => (...args: any[]) => void }) => // ...
```

This function allows you to build custom handlers that will be memoized so that they do not cause a diff in the shallow comparison, which would lead to a re render.

So instead of writing:

```tsx
// This will cause the component to re render every time because the handler is unique in every execution
const Input = ({ onChange, value }) => {
  const handleChange = ({ target }) => onChange(target.value)

  return <input
    onChange={handleChange}
    value={target.value}
  />
}
```

…it allows you to do:

```tsx
import { component, mapHandlers, startWithType } from 'refun'

type TInput = {
  onChange: (string) => void,
  value: string,
}

export default component(
  startWithType<TInput>(),
  mapHandlers({
    onChange: ({ onChange }) => ({ target }) => onChange(target.value),
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

Signature: Not callable

This function sets the `isHovered` prop to `true` when the `onPointerEnter` handler is called and to `false` when `onPointerLeave` is called.

Note that `onPointerEnter` and `onPointerLeave` are synthetic event names meant to abstract from platform specific hover states. In web, they will be typically mapped:

- `onPointerEnter` -> `onMouseEnter`
- `onPointerLeave` -> `onMouseLeave`

…and each platform will have their own corresponding mapping.

```tsx
import { component, mapHovered, startWithType, TMapHovered } from 'refun'

type TButton = {
  label: string
} & TMapHovered

export default component(
  startWithType<TButton>(),
  mapHovered
)(
  ({ isHovered, label, onPointerLeave, onPointerEnter }) => (
    <button
      onMouseLeave={onPointerLeave}
      onMouseEnter={onPointerEnter}
      style={{
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: isHovered ? "red" : "grey",
        outline: "none"
      }}
    >
      {label}
    </button>
  )
)
```

[📺 Check out live demo](https://codesandbox.io/s/refun-maphovered-lfzqj)

## `mapKeyboardFocused`

Signature: Not callable.

This function sets the `isKeyboardFocused` prop to `true` when the target gets focused (after `onFocus`) but only if the focus was acquired via the keyboard interaction, not a pointer event (so if there was no press event before the `onFocus`). The prop is set to `false` once `onBlur` happens.

The reason this is useful is that it allows focus states meant for keyboard navigation to be differentiated from regular focus states. When the user is navigating with the keyboard, for example pressing the Tab key, visual highlighting of the focused elements needs to be more prominent to guide the sight into where the active element is. Pointer events will trigger focus as well, but when the interaction was initiated with a pointer it's not necessary for the highlight to be as prominent, since the user is already focused in the pointer position. In order to distinguish these two states and make it possible to style them separately, you can use `mapFocused` for the general case and `mapKeyboaredFocused` for the specific keyboard navigation case.

Note that `onPressIn` and `onPointerLeave` are synthetic event names meant to abstract from platform specific hover states. In web, they will be typically mapped:

- `onPressIn` -> `onMouseDown`
- `onPressOut` -> `onMouseUp`

…and each platform will have their own corresponding mapping.

```tsx
import { component, mapKeyboardFocused, startWithType, TMapKeyboardFocused } from 'refun'

type TButton = {
  label: string
} & TMapKeyboardFocused

export default component(
  startWithType<TButton>(),
  mapKeyboardFocused
)(
  ({ isKeyboardFocused, label, onBlur, onFocus, onPressIn, onPressOut }) => (
    <button
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseDown={onPressIn}
      onMouseUp={onPressOut}
      style={{
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: isKeyboardFocused ? "red" : "grey",
        outline: "none"
      }}
    >
      {label}
    </button>
  )
)
```

[📺 Check out live demo](https://codesandbox.io/s/refun-mapkeyboardfocused-okqxt)

## `mapPressed`

Signature: Not callable.

This function sets the `isPressed` prop to `true` when the `onPressIn` handler is called and to `false` when `onPressOut` is called.

Note that `onPressIn` and `onPressOut` are synthetic event names meant to abstract from platform specific pressed states. In web, they will be typically mapped:

- `onPressIn` -> `onMouseDown`
- `onPressOut` -> `onMouseUp`

…and each platform will have their own corresponding mapping.

```tsx
import { component, mapPressed, startWithType, TMapPressed } from 'refun'

type TButton = {
  label: string
} & TMapPressed

export default component(
  startWithType<TButton>(),
  mapPressed
)(
  ({ isPressed, label, onPressIn, onPressOut }) => (
    <button
      onMouseDown={onPressIn}
      onMouseUp={onPressOut}
      style={{
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: isPressed ? "red" : "grey",
        outline: "none"
      }}
    >
      {label}
    </button>
  )
)
```

[📺 Check out live demo](https://codesandbox.io/s/refun-mappressed-z8lbx)

## `mapProps`

Signature:

```ts
const mapProps: <P, R>(getFn: (props: P) => R) => // ...
```

This function takes a handler that receives all props and returns new props.

```tsx
import { component, mapProps, startWithType } from 'refun'

type TButton = {
  label: string
}

export default component(
  startWithType<TButton>(),
  mapProps(({ label }) => ({ children: label }))
)(
  ({ children }) => <button>{children}</button>
)
```

Note that `label` is no longer available as a prop to the component. If you want to expand the props with extra ones instead of replacing them consider using [`mapWithProps`](#mapWithProps)

[📺 Check out live demo](https://codesandbox.io/s/refun-mapprops-37ho6)

## `mapRef`

Signature:

```ts
const mapRef: <T>(name: string, initialValue: T) => // ...
```

This function provides a way of making a mutable reference available as a prop. It uses the `useRef` hook under the hood.

Refs are useful to store derived values that do not support shallow comparison, such as functions, or DOM elements.

For example you can use it to capture the `ref` to a DOM element and inspect it:

```tsx
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

## `mapSafeRequestAnimationFrame`

Signature:

```ts
const mapSafeRequestAnimationFrame: (propName: string) => // ...
```

This function allows you to set up operations to be executed in the next animation frame that should only be executed while the component is still mounted, and should be canceled if the component is removed from the tree. Callbacks that are not canceled when unmounted are a common cause of React memory leaks.

Why you ask? Animations. Animations can be done in React by continuously updating style parameters of a component, and the cleanest way of updating those is with `requestAnimationFrame`. This function allows you to use `requestAnimationFrame` without worrying about memory leaks.


> As you can check in this [📺 live demo of the issue](https://codesandbox.io/s/refun-mapsafeanimationframe-problem-demonstration-4t0w1), simply using `requestAnimationFrame` will cause the problems when pressing the "Stop loading" button. In particular, React will log:
> ```
> Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
> ```
> `mapSafeRequestAnimationFrame` does the cleanup for you.

```tsx
import {
  component,
  mapState,
  mapSafeRequestAnimationFrame,
  startWithType,
  mapHandlers
} from 'refun'

type TLoader = {
  initialPosition: number
}

const Loader = component(
  startWithType<TLoader>(),
  mapState(
    "position",
    "setPosition",
    ({ initialPosition }) => initialPosition,
    []
  ),
  mapSafeRequestAnimationFrame("setAnimationFrameCallback")
)(({ position, setPosition, setAnimationFrameCallback }) => {
  setAnimationFrameCallback(() => {
    setPosition((position + 1) % 80)
  })
  return (
    <div
      style={{
        width: 100,
        height: 8,
        border: "1px solid black"
      }}
    >
      <div
        style={{
          width: 20,
          marginLeft: position,
          height: 8,
          backgroundColor: "black"
        }}
      />
    </div>
  )
})

type TApp = {
  loading: boolean
}

export default component(
  startWithType<TApp>(),
  mapState(
    "loading",
    "setLoading",
    ({ loading }) => loading !== undefined ? loading : true,
    []
  ),
  mapHandlers({
    onStop: ({ setLoading }) => () => setLoading(false)
  })
)(({ loading, onStop }) => (
  <div>
    {loading && <Loader initialPosition={0} />}
    <button onClick={onStop}>Stop loading</button>
  </div>
))
```

[📺 Check out live demo](https://codesandbox.io/s/refun-mapsafeanimationframe-s3ttu)

## `mapSafeTimeout`

Signature:

```ts
const mapSafeTimeout: (propName: string) => // ...
```

This function allows you to configure time outs that should only be executed while the component is still mounted, and should be canceled if the component is removed from the tree. Timeouts that are not canceled when unmounted are a common cause of React memory leaks.

> As you can check in this [📺 live demo of the issue](https://codesandbox.io/s/refun-mapsafetimeout-problem-demonstration-dkiwq), simply using `setTimeout` will cause the problems when pressing the "Close immediately" button before the countdown is completed. In particular, React will log:
> ```
> Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
> ```
> `mapSafeTimeout` does the cleanup for you.

```tsx
import {
  component,
  mapHandlers,
  mapState,
  mapSafeTimeout,
  startWithType
} from 'refun'

type TMessage = {
  onClose: () => void
}

const Message = component(
  startWithType<TMessage>(),
  mapState("autoClose", "setAutoClose", () => false, []),
  mapState("secondsRemaining", "setSecondsRemaining", () => 5, []),
  mapSafeTimeout("setLocalTimeout")
)(
  ({
    onClose,
    secondsRemaining,
    setSecondsRemaining,
    setLocalTimeout,
    autoClose,
    setAutoClose
  }) => (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        padding: 20
      }}
    >
      {autoClose ? (
        <React.Fragment>
          <p>This message will close in {secondsRemaining} seconds</p>
          <button onClick={onClose}>Close immediately</button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>
            This message that will close {secondsRemaining} seconds after you
            press OK
          </p>

          <button
            onClick={() => {
              setAutoClose(true)
              setLocalTimeout(() => {
                console.log("timeout 1000")
                setSecondsRemaining(4)
              }, 1000)
              setLocalTimeout(() => {
                console.log("timeout 2000")
                setSecondsRemaining(3)
              }, 2000)
              setLocalTimeout(() => {
                console.log("timeout 3000")
                setSecondsRemaining(2)
              }, 3000)
              setLocalTimeout(() => {
                console.log("timeout 4000")
                setSecondsRemaining(1)
              }, 4000)
              setLocalTimeout(() => {
                console.log("timeout 5000")
                onClose()
              }, 5000)
            }}
          >
            Ok
          </button>
        </React.Fragment>
      )}
    </div>
  )
)

type TApp = {
  show?: boolean
}

export default component(
  startWithType<TApp>(),
  mapState("show", "setShow", ({ show }) => true, []),
  mapHandlers({
    onClose: ({ setShow }) => () => setShow(false),
    onShow: ({ setShow }) => () => setShow(true)
  })
)(({ show, onClose, onShow }) => (
  <div>
    {show ? (
      <Message onClose={onClose} />
    ) : (
      <button onClick={onShow}>Show message again</button>
    )}
  </div>
))
```
[📺 Check out live demo](https://codesandbox.io/s/refun-mapsafetimeout-7mqmh]

## `mapState`

Signature:

```ts
const mapState: <P, R>(stateName: string, setterName: string, getValue: (props: P) => R, watchKeys: string[]) => // ...
```

This function allows you to set up a stateful prop and a function for updating that prop. It also supports setting the initial value, derived from the props passed into it, and a list of props to watch to reset that value whenever the external prop changes.

Note in the example how the `OverridableInternalCounter` sets the `["counter"]` as the last argument of `mapState`. This will cause `mapState` to watch for incoming changes to the `counter` prop and use them to update the `internalCounter` prop, accordingly to the function in the third argument `({ counter }) => counter`. In the case of `InternalCounter`, the array in the last argument is empty (`[]`) and then `mapState` does not watch for changes, which causes the external prop `counter` value to be ignored once updated, effectively working as an initial value only for `internalCounter`.

```tsx
import { component, mapState, startWithType } from 'refun'

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

## `mapStateRef`

Signature:

```ts
const mapStateRef: <P, R>(stateName: string, flushName: string, getValue: (props: P) => R, watchKeys: string[]) => // ...
```

This function allows you to set up a stateful prop and a function for updating that prop. It also supports setting the initial value, derived from the props passed into it, and a list of props to watch to reset that value whenever the external prop changes.

Note in the example how the `OverridableInternalCounter` sets the `["counter"]` as the last argument of `mapState`. This will cause `mapState` to watch for incoming changes to the `counter` prop and use them to update the `internalCounter` prop, accordingly to the function in the third argument `({ counter }) => counter`. In the case of `InternalCounter`, the array in the last argument is empty (`[]`) and then `mapState` does not watch for changes, which causes the external prop `counter` value to be ignored once updated, effectively working as an initial value only for `internalCounter`.

```tsx
import { component, mapStateRef, onMount, startWithType } from 'refun'

type TGetValue = {
  index: number,
  value: number,
  onChange: (i: number, v: number) => void
}

const GetValue = component(
  startWithType<TValue>(),
  onMount(({ index, onChange }) => {
    onChange(index, Math.random())
  })
)(({ value }) => (
  <span>{value}</span>
));

type TComp = {
  numValues: number
}

export default component(
  startWithType<TComp>(),
  mapStateRef('valuesRef', 'flushValues', ({ numValue }) => Array(numValues).fill(0), ['numValues']),
  mapHandlers({
    onChange: ({ valuesRef, flushValues }) => (i, value) => {
      valuesRef.current[i] = value
      flushValues()
    }
  })
)(({ valuesRef }) => (
  <div>
    {valuesRef.current.map((value) => (
      <GetValue value={value} />
    ))}
  </div>
))
```

## `mapThrottledHandlerTimeout`

Signature:

```ts
const mapThrottledHandlerTimeout: (handlerName: string, timeout: number) => // ...
```

> This function is affected by the [React Synthetic Events vs debouncing / throttling](#react-synthetic-events-vs-debouncing--throttling) issue.

This function allows you to defer the execution of a handler for a grace period (specified in milliseconds) and if the handler gets invoked again during that period, it overrides the call with the new invocation, so that when the specified timeout is reached, the last call will be the one executed.

Why you ask? Imagine for example that you have an application that monitors the window size and updates the layout depending on the new size. Window size updates happen very often while the user is performing the resize, and the new layout calculation might be fairly expensive, so the application might become unresponsive. In this case, you could use `mapThrottledHandlerTimeout` to make sure the resize update only happens every 500 milliseconds, which will not be too noticeable to the user, but will avoid a lot of unnecessary work. Because `mapThrottledHandlerTimeout` executes the _last_ invocation of the handler, the value that will be captured is the most recent one, which is important since we want to re layout according to the current size, no the one when the resize action started.

The difference between debouncing and throttling (available in [`mapDebouncedHandlerTimeout`](#mapDebouncedHandlerTimeout)) is that successive calls to a debounced handler will restart the timeout each time, while throttled calls will be executed once the initially set timeout it reached, using the last arguments. Following the FRP convention, this is how debouncing could be represented:

```
throttling in 3 seconds

          1s 2s 3s 4s 5s 6s 7s 8s 9s
received  x--y--------x------------
ran       ------y-----------x------
```

Notice how the timeout initially configured for `x` is respected and the execution happens 3 seconds after the event for `x` is received, but `y` is run instead.

```tsx
import {
  component,
  mapThrottledHandlerTimeout,
  startWithType,
  mapHandlers
} from 'refun'

type TSlider = {
  onChange: (string) => void
}

export default component(
  startWithType<TSlider>(),
  mapHandlers({
    onChange: () => (value) =>
      console.log(`the handler has now been invoked with value: ${value}`)
  }),
  mapThrottledHandlerTimeout('onChange', 300),
  mapHandlers({
    onChange: ({ onChange }) => ({ target}) => onChange(target.value)
  })
)(({ onChange }) => <input type="range" onChange={onChange} max="1000" />)
```

[📺 Check out live demo](https://codesandbox.io/s/refun-mapthrottledhandlertimeout-1ss16)

## `mapThrottledHandlerAnimationFrame`

Signature:

```ts
const mapThrottledHandlerAnimationFrame: (handlerName: string) => // ...
```

> This function is affected by the [React Synthetic Events vs debouncing / throttling](#react-synthetic-events-vs-debouncing--throttling) issue.

This function allows you to defer the execution of a handler until the next animation frame. If the handler gets invoked again before that animation frame hits, the new invocation will override the previous one, so that when the animation frame starts the last call will be the one executed.

Why you ask? Pretty much the same reasons that are true for [`mapThrottledHandlerTimeout`](#mapThrottledHandlerTimeout). Calls that are done between animation frames are wasteful overhead, since the UI will not be updated until the animation frame anyway, so if you have a handler firing continuously, it's a good idea to skip the wasteful ones. This might happen for handlers monitoring scroll or wheel or finger motion actions.

> You might wonder why there is not `mapDebouncedHandlerAnimationFrame` if there is a `mapDebouncedHandlerTimeout`. The reason is that the behavior of that function would be identical to this one, so it's skipped.

```tsx
import {
  component,
  mapThrottledHandlerAnimationFrame,
  startWithType,
  mapHandlers
} from 'refun'

type TSlider = {
  onChange: (string) => void
}

export default component(
  startWithType<TSlider>(),
  mapHandlers({
    onChange: () => (value) =>
      console.log(`the handler has now been invoked with value: ${value}`)
  }),
  mapThrottledHandlerAnimationFrame('onChange'),
  mapHandlers({
    onChange: ({ onChange }) => ({ target: { value } }) => onChange(value)
  })
)(({ onChange }) => <input type="range" onChange={onChange} max="1000" />)
```

[📺 Check out live demo](https://codesandbox.io/s/refun-mapthrottledhandleranimationframe-xk8uc)

## `mapThrottledHandlerFactory`

Signature:

```ts
const mapThrottledHandlerFactory: (setFn: Function, clearFn: Function) => (handlerName: string, ...setFnArgs: any[]) => // ...
```

> All the functions created with this one is affected by the [React Synthetic Events vs debouncing / throttling](#react-synthetic-events-vs-debouncing--throttling) issue.

This function is a constructor for throttlers. It is used under the hood to build the `mapThrottledHandlerTimeout` and `mapThrottledHandlerAnimationFrame` functions. If you have a function that creates a deferred effect and a function that will cancel that deferral, you can build your own throttler.

This is how `mapThrottledHandlerTimeout` is defined:

```ts
export const mapThrottledHandlerTimeout = mapThrottledHandlerFactory(setTimeout, clearTimeout)
```

## `mapWithProps`

Signature:

```ts
const mapWithProps: <P, R>(getFn: (props: P) => R) => // ...
```

This function allows you to expand the props passed in to a component with more props derived from them. It is typically used to precalculate values that are to be used in the component, to minimize the amount of logic needed to do in the render.

If the returned props have the same name as incoming props, they will override the incoming props.

```tsx
import {
  component,
  mapFocused,
  mapWithProps,
  startWithType,
  TMapFocused
} from 'refun'

type TButton = {
  label: string
} & TMapFocused

export default component(
  startWithType<TButton>(),
  mapFocused,
  mapWithProps(({ isFocused }) => ({
    borderColor: isFocused ? "red" : "grey"
  }))
)(({ borderColor, label, onBlur, onFocus }) => (
  <button
    onBlur={onBlur}
    onFocus={onFocus}
    style={{
      borderWidth: 2,
      borderStyle: "solid",
      borderColor,
      outline: "none"
    }}
  >
    {label}
  </button>
))
```

Note that this function just adds props to the component. If you want to replace all of them, you can use [`mapProps`](#mapProps) instead.

[📺 Check out live demo](https://codesandbox.io/s/refun-mapwithprops-cjdsc)

## `mapWithPropsMemo`

Signature:

```ts
const mapWithPropsMemo: <P, R>(getFn: (props: P) => R, watchKeys: string[]) => // ...
```

This function does the same as [`mapWithProps`](#mapWithProps) and it memoizes the result for the props specified in the second parameter.

An example use case in which this can prove useful is if you were to be calculating the Fibonacci number of an input, which is known to be expensive for large numbers:

```tsx
import { component, mapWithPropsMemo, startWithType } from 'refun'

const inefficientFibonacci = position =>
  position < 2
    ? position
    : inefficientFibonacci(position - 1) + inefficientFibonacci(position - 2)

type TFibonacci = {
  position: number
}

export default component(
  startWithType<TFibonacci>(),
  mapWithPropsMemo(
    ({ position }) => ({
      fibonacci: inefficientFibonacci(position)
    }),
    ["position"]
  )
)(({ position, fibonacci }) => (
  <p>
    The Fibonacci numbers in position {position} is <mark>{fibonacci}</mark>
  </p>
))
```

Notice that `mapWithPropsMemo` takes two arguments, and that memoization happens for the props that are specified in the second argument, in this case `position`.

[📺 Check out live demo](https://codesandbox.io/s/refun-mapwithpropsmemo-hjcso)

## `onChange`

Signature:

```ts
const onChange: <P>(handler: (props: P) => Promise<void> | void, watchKeys: string[]) => // ...
```

This function calls the passed in callback when the component is updated, sending the current Props as argument.

For example:

```tsx
import { component, onChange, startWithType } from 'refun'

type TButton = {
  label: string,
}

export default component(
  startWithType<TButton>(),
  onChange(({ label }) => {
    console.log('Updated with label', label)
  }, ['label'])
)(({ label }) => (
  <button>
    {label}
  </button>
))
```

[📺 Check out live demo](https://codesandbox.io/s/refun-onchange-lhvik)

## `onLayout`

Signature:

```ts
const onLayout: <P>(onLayoutHandler: (props: P) => Promise<void> | void, watchKeys: string[]) => // ...
```

This function calls the passed in callback when the component is updated, sending the current Props as argument.

For example:

```tsx
import { component, onLayout, startWithType } from 'refun'

type TButton = {
  label: string,
}

export default component(
  startWithType<TButton>(),
  onLayout(({ label }) => {
    console.log('Updated with label', label)
  }, ['label'])
)(({ label }) => (
  <button>
    {label}
  </button>
))
```

## `onUpdate`

Signature:

```ts
const onUpdate: <P>(onUpdateFn: (props: P) => (() => void) | void, watchKeys: string[]) => // ...
```

This function calls the passed in callback when the component is mounted and updated, sending the current Props as an argument.
> Pass certain propery keys as an array, to invoke handler only when such props has been updated.  
> It is possible to return some *unsubscribe* function from *onUpdateHandler*. It will be called before next *onUpdate*.  
> If watch array is empty *onUpdateHandler* will be called only for component mount and unmount cases.

For example:

```tsx
import { component, onUpdate, startWithType } from 'refun'

type TButton = {
  label: string,
}

export default component(
  startWithType<TButton>(),
  onUpdate(({ label }) => {
    console.log('Updated with label', label)

    const handler = () => {}
    window.addEventListener('resize', handler)

    return () => {
      window.removeEventListener('resize', handler)
    }
  }, ['label'])
)(({ label }) => (
  <button>
    {label}
  </button>
))
```

[📺 Check out live demo](https://codesandbox.io/s/refun-onupdate-x8wln)

## `onUpdateAsync`

Signature:

```ts
const onUpdateAsync: <P>(onUpdateFn: (propsRef: React.RefObject<P>) => (props: { cancelOthers: () => void, index: number }) => Generator<Promise<unknown>>, watchKeys: string[]) => // ...
```

This is `onUpdate` variant that properly handles asynchronous behavior.
> `propsRef` is a `props` reference, so *current* props are always available even after long waiting for some promises.  
> `cancelOthers` provides a way to stop all concurrently running *routines*, if necessary. Canceled routine can use `finally` keyword to make some cleanup.  
> Think of `function*` as the usual `async` function, which uses `yield` instead of `await`.

For example:

```tsx
import { component, onUpdateAsync, startWithType } from 'refun'

type TComponent = {
  ID: string,
}

export default component(
  startWithType<TComponent>(),
  mapState('state', 'setState', () => null, [])
  onUpdateAsync((propsRef) => function* ({ cancelOthers, index }) {
    try {
      // cancel all concurrently running routines
      cancelOthers()

      // use 'yield' instead of 'await'
      const res = yield fetch(`http://url.com?id=${props.current.ID}`)
      const json = yield res.json()

      props.current.setState(json)

    } finally {
      cleanup()
    }
}, ['ID'])
)(({ state }) => (
  <div>
    {state}
  </div>
))
```

## `startWithType`

Signature:

```ts
const startWithType: <P>() => // ...
```

This function is simply a way of setting up the initial type in the [`component`](#component) composition chain, since TypeScript does not currently support doing that in the composition function itself (`component` in this case, but would be `compose` in Redux, Ramda, etc).

It's purpose is entirely for types, and in runtime it's a no-op.

```tsx
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

```tsx
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

## `StoreContextFactory`

Signature:

```ts
const StoreContextFactory: <S>(store: Redux.Store<S>) => {
  mapStoreState: <R>(mapStateToProps: (state: S) => R, stateKeysToWatch: string[]) => // ...
  mapStoreDispatch: (dispatchPropName: string) => // ...
}
```

This function is a way of working with Redux stores together with React Hooks. It is an alternative to React Redux, with these goals:

1. Work with Hooks, avoiding higher-order components
2. Respect the types all throughout
3. Match the level of optimization of React Redux.

The way this function works is that it receives a Redux Store object, and returns a component and two functions:

- `StoreProvider` is a component that provides the React Context already loaded with the store that was passed in to the `StoreContextFactory`
- `mapStoreDispatch` is a function to be used as part of a `component` or `pureComponent` composition, which will simply add `dispatch` to the props, so that the component being wrapped by it can dispatch actions.
- `mapStoreState` is a function to be used as part of a `component` or `pureComponent` composition, which will add props derived from the state. Much like `connect` from React Redux, it receives a `mapStateToProps` function that will be called with the full state and which return value will be spread over the component props. `mapStoreState` takes as a second argument an array of the names of the props to watch in order to run the `mapStateToProps` function: if none of the listed props have changed, the `mapStateToProps` will not be ran.

Check the example below for a full use case.

```tsx
import { createStore } from "redux"
import { component, pureComponent, StoreContextFactory, mapHandlers, startWithType } from 'refun'

type TState = {
  counter: number
}

type TAction = { type: "INCREMENT" payload: number } | { type: "RESET" }

const reducer = (state: TState, action: TAction): TState => {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        counter: state.counter + action.payload
      }

    case "RESET":
      return {
        ...state,
        counter: 0
      }

    default:
      return state
  }
}

const initialState = {
  counter: 7
}

const store = createStore(reducer, initialState)

const { mapStoreState, mapStoreDispatch } = StoreContextFactory(store)

const CounterDisplay = pureComponent(
  startWithType<{}>(),
  mapStoreState(
    ({ counter }) => ({
      counter
    }),
    ["counter"]
  )
)(({ counter }) => (
  <div>
    <p>Counter: {counter}</p>
  </div>
))

const ResetButton = component(
  startWithType<{}>(),
  mapStoreDispatch('dispatch'),
  mapHandlers({
    onClick: ({ dispatch }) => () =>
      dispatch({
        type: "RESET"
      })
  })
)(({ onClick }) => (
  <div>
    <button onClick={onClick}>Reset</button>
  </div>
))

const IncrementButton = component(
  startWithType<{}>(),
  mapStoreDispatch('dispatch'),
  mapHandlers({
    onClick: ({ dispatch }) => () =>
      dispatch({
        type: "INCREMENT",
        payload: 1
      })
  })
)(({ onClick }) => (
  <div>
    <button onClick={onClick}>Increment</button>
  </div>
))

export default () => (
  <div>
    <CounterDisplay />
    <ResetButton />
    <IncrementButton />
  </div>
)
```

[📺 Check out live demo](https://codesandbox.io/s/refun-storecontextfactory-l9bp5)

## Caveats

### React Synthetic Events vs debouncing / throttling

The `mapDebounced*` and `mapThrottled*` family of functions do not accept React Synthetic Events. As you can see in the examples below, some specific properties of the event (`value` in that case) need to be extracted from the original Synthetic Event in order for them to work.

This is necessary because these two function families store the arguments passed to the handlers for delayed use. If that argument is a Synthetic Event, it will be stored to be reused, but React forbids this, because for performance reasons React reuses the references of Synthetic Events and mutates them.

> If you try the example below without the `mapHandlers`, you will get:
>
> ```
> Warning: This synthetic event is reused for performance reasons. If you're seeing this, you're accessing the property `target` on a released/nullified synthetic event. This is set to null. If you must keep the original synthetic event around, use event.persist(). See https://fb.me/react-event-pooling for more information.
> ```
>
> [📺 Check out live demo](https://codesandbox.io/s/refun-mapthrottledhandlertimeout-wrong-usage-7q6cd)


If you are going to use information coming from the Synthetic Event, consider extracting the information you care about using `mapHandlers`, which will then let React discard the rest of the Event object.

If you are not going to use _any_ information coming from the Event—such as in the example for [`mapDebouncedHandlerTimeout`](#mapDebouncedHandlerTimeout)—then you will not be affected by this issue.

```tsx
import {
  component,
  mapThrottledHandlerTimeout,
  startWithType,
  mapHandlers
} from 'refun'

type TSlider = {
  onChange: (string) => void
}

export default component(
  startWithType<TSlider>(),
  mapHandlers({
    onChange: () => (value) =>
      console.log(`the handler has now been invoked with value: ${value}`)
  }),
  mapThrottledHandlerTimeout("onChange", 300),
  mapHandlers({
    onChange: ({ onChange }) => ({ target: { value } }) => onChange(value)
  })
)(({ onChange }) => <input type="range" onChange={onChange} max="1000" />)
```

[📺 Check out live demo](https://codesandbox.io/s/refun-mapthrottledhandlertimeout-1ss16)

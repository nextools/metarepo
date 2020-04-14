## v1.0.1

* 🐞 re-publish using new build system to fix `tsfn` issues

## v1.0.0

* 💥 drop Node.js v8 support and require >=10.13.0 (first v10 LTS)

* 💥 require explicit name for dispatch prop

* 🌱 add `onLayout`

* 🐞 fix props assignment in `onChange`

* 🐞 subscribe to store on consumer side

* ♻️ update dependencies: `tsfn`

## v0.4.5

* 🐞 add `Context` to result of Redux factory
* 🐞 remove `Dispatch` restriction from redux factories
* 🐞 fix `mapStateRef` state setter

## v0.4.4

* 🐞 rename `mapReduxState` to `ReduxStateFactory` and `mapReduxDispatch` to `ReduxDispatchFactory`
* 🐞 remove `mapReducer`
* 🐞 prevent calling `set` function after unmount in `mapSafeTimeout` and `mapSafeRequestAnimationFrame`
* 🐞 fix `mapStateRef` to rerender on flush
* 🐞 remove `getElementName` and `getComponentName` functions
* 🐞 make `onChange` invoke on first render
* 🐞 allow async function in `onChange`
* 🐞 add `onMountUnmount`
* 🐞 enhance `mapDefaultProps`
* 🐞 add `onUnmount`, allow async functions
* 🐞 optimize `onUpdate`, allow async functions
* 🐞 optimize `onMount`, allow async functions
* 🐞 fix dangling functions in `mapFocused`, `mapHovered`, `mapPressed`, `mapKeyboardFocused`
* 🐞 fix `mapRef` type

## v0.4.3

* 🐞 fix `mapRef` types
* 🐞 improve `mapDefaultProps` performance

## v0.4.2

* 🐞 add `onUpdate`

## v0.4.1

* 🐞 add `mapStateRef`
* 🐞 remove function as argument in `setState` of `mapState`

## v0.4.0

* 🌱 handle function as argument in `setState` of `mapState`
* 🌱 add `mapHandlersFactory`
* 🌱 add `onChange`
* 🐞 expose `Dispatch` type in `mapRedux`
* 🐞 add more type overloads to `component` and `pureComponent`
* ♻️ update dependencies: `tsfn`

## v0.3.4

* 🐞 tweak `redux` dependency semver range

## v0.3.3

* 🐞 cleanup and fix deps

## v0.3.2

* 🐞 remove mapDebouncedHandlerAnimationFrame, which is redundant with throttling animation frame

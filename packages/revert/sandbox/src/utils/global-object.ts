export const globalObject = (global as unknown) as Window & {
  requestIdleCallback?: (cb: () => void) => any,
  cancelIdleCallback?: (id: any) => void,
  __REDUX_DEVTOOLS_EXTENSION__?: () => any,
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: () => any,
}

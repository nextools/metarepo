export const globalObject = (global as unknown) as Window & {
  requestIdleCallback?: (cb: () => void) => any,
  cancelIdleCallback?: (id: any) => void,
}

export type TimeoutId = any
export type SetTimeoutFn = (cb: () => void, ms: number) => TimeoutId
export type ClearTimeoutFn = (id: TimeoutId) => void

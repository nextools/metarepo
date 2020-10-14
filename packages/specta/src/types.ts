export type TNext<T> = (value: T) => void
export type TDone = () => void
export type TError = (err: Error) => void
export type TUnsubscribe = () => void
export type TObservable<T> = (next: TNext<T>, done?: TDone, error?: TError) => TUnsubscribe
export type TUnwrapObserverable<T> = T extends TObservable<infer U> ? U : never

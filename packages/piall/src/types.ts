export type TMaybePromise<T> = Promise<T> | T

export type TFulfilled<T> = {
  status: 'fulfilled',
  value: T,
}

export type TRejected = {
  status: 'rejected',
  reason: Error | string,
}


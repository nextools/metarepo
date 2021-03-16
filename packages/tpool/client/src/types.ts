export type TMessageHandshake = {
  threadIds: number[],
}

export type TMessageDone<T> = {
  type: 'DONE',
  uid: string,
  value: T,
}

export type TMessageError = {
  type: 'ERROR',
  uid: string,
  value: string,
}

export type TMessage<T> = TMessageDone<T> | TMessageError

export type TPipeThreadPoolOptions = {
  pools: string[],
}

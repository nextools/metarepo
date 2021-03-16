export type TMessageHandshake = {
  threadIds: number[],
}

export type TMessageDone<T> = {
  type: 'DONE',
  id: string,
  threadId: number,
  value: T,
}

export type TMessageError = {
  type: 'ERROR',
  id: string,
  threadId: number,
  value: string,
}

export type TMessage<T> = TMessageDone<T> | TMessageError

export type TPipeThreadPoolOptions = {
  socketPath: string,
}

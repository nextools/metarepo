export type TMessageDone<T> = {
  type: 'DONE',
  id: string,
  value: T,
}

export type TMessageError = {
  type: 'ERROR',
  id: string,
  value: string,
}

export type TMessage<T> = TMessageDone<T> | TMessageError

export type TConnectToThreadPoolOptions = {
  socketPath: string,
}

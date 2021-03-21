import type { TJsonValue } from 'typeon'

export declare type THandshakeFromClient = {
  taskString: string,
  arg: TJsonValue,
  callerDir: string,
  groupBy: number,
  groupType: 'serial' | 'concurrent',
}

export declare type THandshakeFromServer = {
  threadIds: number[],
}

export declare type TMessageFromClient = {
  uid: string,
  threadId: number,
  group: TJsonValue[],
}

export type TServerMessageDone<T> = {
  type: 'DONE',
  uid: string,
  value: T,
}

export type TServerMessageError = {
  type: 'ERROR',
  uid: string,
  value: TJsonValue,
}

export type TMessageFromServer<T> = TServerMessageDone<T> | TServerMessageError

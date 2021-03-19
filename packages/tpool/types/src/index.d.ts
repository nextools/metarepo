import type { TJsonValue } from 'typeon'

export declare type TClientHandshake = {
  fnString: string,
  callerDir: string,
  groupBy: number,
  groupType: 'serial' | 'concurrent',
}

export declare type TServerHandshake = {
  threadIds: number[],
}

export declare type TClientMessage = {
  uid: string,
  threadId: number,
  arg: TJsonValue[],
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

export type TServerMessage<T> = TServerMessageDone<T> | TServerMessageError

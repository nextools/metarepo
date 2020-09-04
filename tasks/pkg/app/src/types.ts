import type { TJsonValue } from 'typeon'

export type TAction<T extends string> = {
  type: T,
  error?: boolean,
  meta?: TJsonValue,
}

export type TActionWithPayload<T extends string, P extends TJsonValue> = {
  type: T,
  payload: P,
  error?: boolean,
  meta?: TJsonValue,
}

export type TState = {
  foo: string,
}

export type TApp = {}

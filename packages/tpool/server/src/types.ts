import type { TlsOptions } from 'tls'
import type { THandshakeFromClient } from '@tpool/types'
import type { TJsonValue } from 'typeon'

export type TStartThreadPoolOptions = {
  threadCount: number,
  url: string,
  tls?: TlsOptions,
}

export type TMessageFromWokerDone = {
  type: 'DONE',
  value: TJsonValue,
}

export type TMessageFromWorkerError = {
  type: 'ERROR',
  value: string,
}

export type TMessageFromWorker = TMessageFromWokerDone | TMessageFromWorkerError

export type TMessageToWorker = THandshakeFromClient & { group: TJsonValue[] }

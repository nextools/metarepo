import type { TJsonValue } from 'typeon'

export type TStartPoolOptions = {
  threadCount: number,
}

export type TPipePoolOptions = {
  groupBy?: number,
  groupType?: 'serial' | 'concurrent',
}

export type TMessageToWorkerTask = {
  type: 'TASK',
  value: {
    taskString: string,
    arg: TJsonValue,
    callerDir: string,
    group: TJsonValue[],
    groupBy: number,
    groupType: 'serial' | 'concurrent',
  }
}

export type TMessageToWorkerExit = {
  type: 'EXIT'
}

export type TMessageToWorker = TMessageToWorkerTask | TMessageToWorkerExit

export type TMessageFromWorkerDone<T> = {
  type: 'DONE',
  value: T,
}

export type TMessageFromWorkerError = {
  type: 'ERROR',
  value: string,
}

export type TMessageFromWorker<T> = TMessageFromWorkerDone<T> |TMessageFromWorkerError

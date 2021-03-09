import type EventEmitter from 'events'

export const once = <T>(emitter: EventEmitter, eventName: string): Promise<T> =>
  new Promise((resolve, reject) => {
    const onError = (error: any) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      emitter.removeListener(eventName, onEvent)
      reject(error)
    }
    const onEvent = (result: any) => {
      emitter.removeListener('error', onError)
      resolve(result)
    }

    emitter.once('error', onError)
    emitter.once(eventName, onEvent)
  })

export const sleep = (timeout: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, timeout))


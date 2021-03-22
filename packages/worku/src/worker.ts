/* eslint-disable @typescript-eslint/no-use-before-define */
import type { TransferListItem, Worker } from 'worker_threads'

export const waitForWorker = (worker: Worker): Promise<Worker> => {
  return new Promise((resolve, reject) => {
    const onExit = (code: number) => {
      worker.removeListener('error', onError)
      worker.removeListener('online', onOnline)
      reject(`Worker has exited while getting ready, code: ${code}`)
    }
    const onError = (error: any) => {
      worker.removeListener('exit', onExit)
      worker.removeListener('online', onOnline)
      reject(error)
    }
    const onOnline = () => {
      worker.removeListener('exit', onExit)
      worker.removeListener('error', onError)
      resolve(worker)
    }

    worker.once('exit', onExit)
    worker.once('error', onError)
    worker.once('online', onOnline)
  })
}

export const sendAndReceiveOnWorker = <T, R>(worker: Worker, value: T, transferList?: readonly TransferListItem[]): Promise<R> => {
  return new Promise((resolve, reject) => {
    const onExit = (code: number) => {
      worker.removeListener('error', onError)
      worker.removeListener('messageerror', onMessageError)
      worker.removeListener('message', onMessage)
      reject(`Worker has exited while waiting for a message, code: ${code}`)
    }
    const onError = (error: any) => {
      worker.removeListener('exit', onExit)
      worker.removeListener('messageerror', onMessageError)
      worker.removeListener('message', onMessage)
      reject(error)
    }
    const onMessageError = (error: any) => {
      worker.removeListener('exit', onExit)
      worker.removeListener('error', onError)
      worker.removeListener('message', onMessage)
      reject(error)
    }
    const onMessage = (result: R) => {
      worker.removeListener('exit', onExit)
      worker.removeListener('error', onError)
      worker.removeListener('messageerror', onMessageError)
      resolve(result)
    }

    worker.once('exit', onExit)
    worker.once('error', onError)
    worker.once('messageerror', onMessageError)
    worker.once('message', onMessage)

    worker.postMessage(value, transferList)
  })
}

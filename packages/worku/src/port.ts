/* eslint-disable @typescript-eslint/no-use-before-define */
import type { MessagePort, TransferListItem } from 'worker_threads'

export const sendToPort = <T>(port: MessagePort, value: T, transferList?: readonly TransferListItem[]): void => {
  port.postMessage(value, transferList)
}

export const receiveOnPort = <T>(port: MessagePort): Promise<T> => {
  return new Promise((resolve, reject) => {
    const onClose = (error: any) => {
      port.removeListener('messageerror', onMessageError)
      port.removeListener('message', onMessage)
      reject(error)
    }
    const onMessageError = (error: any) => {
      port.removeListener('close', onClose)
      port.removeListener('message', onMessage)
      reject(error)
    }
    const onMessage = (result: T) => {
      port.removeListener('close', onClose)
      port.removeListener('messageerror', onMessageError)
      resolve(result)
    }

    port.once('close', onClose)
    port.once('messageerror', onMessageError)
    port.once('message', onMessage)
  })
}

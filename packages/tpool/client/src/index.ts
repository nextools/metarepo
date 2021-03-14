import { randomBytes } from 'crypto'
import { mapAsync } from 'iterama'
import { piAllAsync } from 'piall'
import type { TJsonValue } from 'typeon'
import { once } from 'wans'
import WS from 'ws'

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

export const mapThreadPool = <T extends TJsonValue, R extends TJsonValue>(mapFn: (arg: T) => Promise<R>, options: TConnectToThreadPoolOptions) => async (it: AsyncIterable<T>): Promise<AsyncIterable<R>> => {
  const client = new WS(`ws+unix://${options.socketPath}`)

  await once(client, 'open')

  const sendToThreadPool = (message: T): Promise<R> => {
    const id = randomBytes(16).toString('hex')

    client.send(JSON.stringify({
      id,
      message,
    }))

    return new Promise((resolve, reject) => {
      const onMessage = (data: string) => {
        const message = JSON.parse(data) as TMessage<R>

        if (message.id === id) {
          if (message.type === 'DONE') {
            resolve(message.value)
          } else if (message.type === 'ERROR') {
            reject(message.value)
          }

          client.removeListener('message', onMessage)
        }
      }

      client.on('message', onMessage)
    })
  }

  const fnString = mapFn.toString()

  const mapped = mapAsync((arg: T) => async () => {
    const result = await sendToThreadPool(arg)

    return result
  })(it)

  return piAllAsync(mapped, 8)
}

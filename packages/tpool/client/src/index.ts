import { randomBytes } from 'crypto'
import { mapAsync } from 'iterama'
import { piAllAsync } from 'piall'
import type { TJsonValue } from 'typeon'
import { once } from 'wans'
import WS from 'ws'
import type { TConnectToThreadPoolOptions, TMessage } from './types'

export const mapThreadPool = <T extends TJsonValue, R extends TJsonValue>(mapFn: (arg: T) => Promise<R>, options: TConnectToThreadPoolOptions) => async (it: AsyncIterable<T>): Promise<AsyncIterable<R>> => {
  const client = new WS(`ws+unix://${options.socketPath}`)

  await once(client, 'open')

  const fnString = mapFn.toString()

  const mapped = mapAsync((arg: T) => (): Promise<R> => {
    const id = randomBytes(16).toString('hex')

    client.send(
      JSON.stringify({
        id,
        message: { arg, fnString },
      })
    )

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
  })(it)

  return piAllAsync(mapped, 8)
}

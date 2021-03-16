import { randomBytes } from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import getCallerFile from 'get-caller-file'
import { mapAsync } from 'iterama'
import { piAllAsync } from 'piall'
import type { TJsonValue } from 'typeon'
import { jsonParse, jsonStringify } from 'typeon'
import { once } from 'wans'
import WS from 'ws'
import type { TPipeThreadPoolOptions, TMessage, TMessageHandshake } from './types'

export const pipeThreadPool = <T extends TJsonValue, R extends TJsonValue>(mapFn: (arg: AsyncIterable<T>) => Promise<AsyncIterable<R>>, options: TPipeThreadPoolOptions) => {
  const callerDir = fileURLToPath(path.dirname(getCallerFile()))

  return async (it: AsyncIterable<T>): Promise<AsyncIterable<R>> => {
    const client = new WS(`ws+unix://${options.socketPath}`)
    const { threadIds } = jsonParse<TMessageHandshake>(await once(client, 'message'))
    const fnString = mapFn.toString()

    const busyWorkers = new Set<number>()

    const mapped = mapAsync((arg: T) => (): Promise<R> => {
      const id = randomBytes(16).toString('hex')
      const threadId = threadIds.find((id) => !busyWorkers.has(id))!

      busyWorkers.add(threadId)

      client.send(
        jsonStringify({
          id,
          threadId,
          value: {
            arg,
            fnString,
            callerDir,
          },
        })
      )

      return new Promise((resolve, reject) => {
        const onMessage = (data: string) => {
          const message = jsonParse<TMessage<R>>(data)

          if (message.id === id) {
            if (message.type === 'DONE') {
              resolve(message.value)
            } else if (message.type === 'ERROR') {
              reject(message.value)
            }

            client.removeListener('message', onMessage)

            busyWorkers.delete(message.threadId)
          } else if (message.id === null) {
            reject(message.value)
          }
        }

        client.on('message', onMessage)
      })
    })(it)

    return piAllAsync(mapped, threadIds.length)
  }
}

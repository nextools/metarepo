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
    const uids: string[] = []
    const busyUids = new Set<string>()
    const uidToClient = new Map<string, WS>()
    const uidToThreadId = new Map<string, number>()

    await Promise.all(
      options.pools.map(async (poolAddress) => {
        const client = new WS(poolAddress)
        const message = await once<string>(client, 'message')
        const handshake = jsonParse<TMessageHandshake>(message)

        for (const threadId of handshake.threadIds) {
          const uid = `${threadId}@${poolAddress}`

          uids.push(uid)
          uidToClient.set(uid, client)
          uidToThreadId.set(uid, threadId)
        }
      })
    )

    const fnString = mapFn.toString()

    const mapped = mapAsync((arg: T) => (): Promise<R> => {
      const uid = uids.find((uid) => !busyUids.has(uid))!
      const client = uidToClient.get(uid)!
      const threadId = uidToThreadId.get(uid)!

      busyUids.add(uid)

      client.send(
        jsonStringify({
          uid,
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

          if (message.uid === uid) {
            if (message.type === 'DONE') {
              resolve(message.value)
            } else if (message.type === 'ERROR') {
              reject(message.value)
            }

            client.removeListener('message', onMessage)

            busyUids.delete(uid)
          } else if (uid === null) {
            reject(message.value)
          }
        }

        client.on('message', onMessage)
      })
    })(it)

    return piAllAsync(mapped, uids.length)
  }
}

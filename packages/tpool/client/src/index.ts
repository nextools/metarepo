import path from 'path'
import { fileURLToPath } from 'url'
import getCallerFile from 'get-caller-file'
import { mapAsync } from 'iterama'
import { piAllAsync } from 'piall'
import type { TJsonValue } from 'typeon'
import { jsonParse, jsonStringify } from 'typeon'
import { once } from 'wans'
import WS from 'ws'
import { finallyAsync } from './finally-async'
import type { TPipeThreadPoolOptions, TMessage, TMessageHandshake, TPromiseExecutor } from './types'

export const pipeThreadPool = <T extends TJsonValue, R extends TJsonValue>(mapFn: (arg: AsyncIterable<T>) => Promise<AsyncIterable<R>>, options: TPipeThreadPoolOptions) => {
  const callerDir = fileURLToPath(path.dirname(getCallerFile()))

  return async (it: AsyncIterable<T>): Promise<AsyncIterable<R>> => {
    const clients = new Set<WS>()
    const uids: string[] = []
    const busyUids = new Set<string>()
    const uidToClient = new Map<string, WS>()
    const uidToThreadId = new Map<string, number>()
    const uidToPromiseExecutor = new Map<string, TPromiseExecutor<R>>()

    await Promise.all(
      options.pools.map(async (poolAddress) => {
        const client = new WS(poolAddress)
        const message = await once<string>(client, 'message')
        const handshake = jsonParse<TMessageHandshake>(message)

        clients.add(client)

        for (const threadId of handshake.threadIds) {
          const uid = `${threadId}@${poolAddress}`

          uids.push(uid)
          uidToClient.set(uid, client)
          uidToThreadId.set(uid, threadId)
        }
      })
    )

    for (const client of clients) {
      client.on('message', (data: string) => {
        const message = jsonParse<TMessage<R>>(data)
        const promiseExecutor = uidToPromiseExecutor.get(message.uid)!

        if (message.type === 'DONE') {
          promiseExecutor.resolve(message.value)
        } else if (message.type === 'ERROR') {
          promiseExecutor.reject(message.value)
        }

        uidToPromiseExecutor.delete(message.uid)
        busyUids.delete(message.uid)
      })
    }

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
        uidToPromiseExecutor.set(uid, { resolve, reject })
      })
    })(it)

    return finallyAsync(
      piAllAsync(mapped, uids.length),
      () => {
        for (const client of clients) {
          client.close()
        }
      }
    )
  }
}

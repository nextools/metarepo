import path from 'path'
import { fileURLToPath } from 'url'
import type { TClientHandshake, TClientMessage, TServerHandshake, TServerMessage } from '@tpool/types'
import { pipe } from 'funcom'
import getCallerFile from 'get-caller-file'
import { mapAsync } from 'iterama'
import { piAllAsync } from 'piall'
import { jsonParse, jsonStringify } from 'typeon'
import type { TJsonValue } from 'typeon'
import { once } from 'wans'
import WS from 'ws'
import { finallyAsync } from './finally-async'
import { groupByAsync } from './group-by-async'
import { startWithTypeAsync } from './start-with-type-async'
import type { TPipeThreadPoolOptions, TPromiseExecutor } from './types'
import { ungroupAsync } from './ungroup-async'

const DEFAULT_GROUP_BY = 1
const DEFAULT_GROUP_TYPE = 'serial'

export const pipeThreadPool = <T extends TJsonValue, R extends TJsonValue>(mapFn: (arg: AsyncIterable<T>) => Promise<AsyncIterable<R>>, options: TPipeThreadPoolOptions) => {
  const callerDir = fileURLToPath(path.dirname(getCallerFile()))
  const fnString = mapFn.toString()
  const groupBy = options.groupBy ?? DEFAULT_GROUP_BY
  const groupType = options.groupType ?? DEFAULT_GROUP_TYPE

  return async (it: AsyncIterable<T>): Promise<AsyncIterable<R>> => {
    const clients = new Set<WS>()
    const uids: string[] = []
    const busyUids = new Set<string>()
    const uidToClient = new Map<string, WS>()
    const uidToThreadId = new Map<string, number>()
    const uidToPromiseExecutor = new Map<string, TPromiseExecutor<R[]>>()

    await Promise.all(
      options.pools.map(async (poolAddress) => {
        const client = new WS(poolAddress)

        clients.add(client)

        await once(client, 'open')

        client.send(
          jsonStringify<TClientHandshake>({
            fnString,
            callerDir,
            groupBy,
            groupType,
          })
        )

        const message = await once<string>(client, 'message')
        const handshake = jsonParse<TServerHandshake>(message)

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
        const message = jsonParse<TServerMessage<R[]>>(data)
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

    const mapper = (arg: T[]) => (): Promise<R[]> => {
      const uid = uids.find((uid) => !busyUids.has(uid))!
      const client = uidToClient.get(uid)!
      const threadId = uidToThreadId.get(uid)!

      busyUids.add(uid)

      client.send(
        jsonStringify<TClientMessage>({
          uid,
          threadId,
          arg,
        })
      )

      return new Promise((resolve, reject) => {
        uidToPromiseExecutor.set(uid, { resolve, reject })
      })
    }

    return pipe(
      startWithTypeAsync<T>(),
      groupByAsync(groupBy),
      mapAsync(mapper),
      piAllAsync(uids.length),
      ungroupAsync,
      finallyAsync(() => {
        for (const client of clients) {
          client.close()
        }
      })
    )(it)
  }
}

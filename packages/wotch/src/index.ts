import { resolve } from 'path'
import { createCancelToken } from './create-cancel-token'
import type { TCancelFn, TWatchEvent } from './types'
import { watchIt } from './watch-it'

const watchDir = (rootDir: string): AsyncIterable<string> => ({
  async *[Symbol.asyncIterator]() {
    const queueNext = async (iterator: AsyncIterator<TWatchEvent>) => ({
      iterator,
      result: await iterator.next(),
    })
    const sources = new Map<AsyncIterator<TWatchEvent>, Promise<{iterator: AsyncIterator<TWatchEvent>, result: IteratorResult<TWatchEvent> }>>()
    const dirToIterator = new Map<string, AsyncIterator<TWatchEvent>>()
    const dirToCancel = new Map<string, TCancelFn>()

    const addDirToWatch = (dir: string) => {
      const { cancel, token } = createCancelToken()
      const it = watchIt(dir, token)
      const iterator = it[Symbol.asyncIterator]()

      sources.set(iterator, queueNext(iterator))
      dirToIterator.set(dir, iterator)
      dirToCancel.set(dir, cancel)
    }

    const removeDirFromWatch = (dir: string) => {
      const iterator = dirToIterator.get(dir)!
      const cancel = dirToCancel.get(dir)!

      cancel()
      sources.delete(iterator)
      dirToIterator.delete(dir)
      dirToCancel.delete(dir)
    }

    addDirToWatch(rootDir)

    while (sources.size > 0) {
      const winner = await Promise.race(sources.values())

      if (winner.result.done !== true) {
        const { value } = winner.result

        if (value.type === 'ADD_DIR') {
          addDirToWatch(value.path)
        } else if (value.type === 'REMOVE_DIR') {
          removeDirFromWatch(value.path)
        } else {
          yield value.path
        }

        sources.set(winner.iterator, queueNext(winner.iterator))
      }
    }
  },
})

const rootDir = resolve('tmp/watch')

for await (const e of watchDir(rootDir)) {
  console.log(e)
}

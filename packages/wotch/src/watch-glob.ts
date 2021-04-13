import { resolve } from 'path'
import globParent from 'glob-parent'
import { createCancelToken } from './create-cancel-token'
import { dirMatcher, fileMatcher } from './matcher'
import type { TCancelFn, TQueueNext, TWatchEvent } from './types'
import { watchIt } from './watch-it'

export const watchGlob = (negatedGlobs: Iterable<string>) => (glob: string): AsyncIterable<string> => ({
  async *[Symbol.asyncIterator]() {
    const rootDir = globParent(glob)
    const isFileMatching = fileMatcher(glob, negatedGlobs)
    const isDirMatching = dirMatcher(glob, negatedGlobs)
    const queueNext = async (iterator: AsyncIterator<TWatchEvent>): TQueueNext => ({
      iterator,
      result: await iterator.next(),
    })
    const sources = new Map<AsyncIterator<TWatchEvent>, TQueueNext>()
    const iterators = new Map<string, AsyncIterator<TWatchEvent>>()
    const cancels = new Map<string, TCancelFn>()

    const addDirToWatch = (dir: string) => {
      const { cancel, cancelToken } = createCancelToken()
      const it = watchIt({
        dir,
        isFileMatching,
        isDirMatching,
        cancelToken,
      })
      const iterator = it[Symbol.asyncIterator]()

      sources.set(iterator, queueNext(iterator))
      iterators.set(dir, iterator)
      cancels.set(dir, cancel)
    }

    const removeDirFromWatch = async (dir: string) => {
      const iterator = iterators.get(dir)!
      const cancel = cancels.get(dir)!

      // try to reject "stuck" promise which holds
      // `yield` if we've pulled it already
      cancel()
      // finish iterator if there was no pull yet
      // and therefore no promise to cancel
      await iterator.return!()

      // cleanup
      sources.delete(iterator)
      iterators.delete(dir)
      cancels.delete(dir)
    }

    addDirToWatch(rootDir)

    try {
      // merge multiple dir watchers
      while (sources.size > 0) {
        const winner = await Promise.race(sources.values())

        // `done === true` should never happen here because we always
        // finish iterators manually using "cancel tokens" and remove
        // them from `sources` before the next pull iteration
        if (winner.result.done !== true) {
          const { value } = winner.result

          if (value.type === 'ADD_DIR') {
            addDirToWatch(value.path)
          } else if (value.type === 'REMOVE_DIR') {
            await removeDirFromWatch(value.path)
          } else {
            yield resolve(value.path)
          }

          sources.set(winner.iterator, queueNext(winner.iterator))
        }
      }
    } finally {
      for (const dir of iterators.keys()) {
        await removeDirFromWatch(dir)
      }
    }
  },
})

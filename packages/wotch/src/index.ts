import { watch } from 'fs'
import type { Stats } from 'fs'
import { readdir, stat } from 'fs/promises'
import { resolve } from 'path'
import { createCancelToken } from './create-cancel-token'
import type { TCancelFn, TCancelToken, TWatchEvent } from './types'

const watchIt = (dir: string, cancelToken: TCancelToken): AsyncIterable<TWatchEvent> => ({
  async *[Symbol.asyncIterator]() {
    const dirStats = new Map<string, Stats>()
    let results: TWatchEvent[] = []
    let hasError = false
    let error: any
    let resolver: null | ((results: TWatchEvent[]) => void) = null
    let rejecter: null | ((error: any) => void) = null

    cancelToken.onCancel = () => {
      if (rejecter !== null) {
        rejecter(cancelToken.symbol)
      }
    }

    const dirList = await readdir(dir)

    for (const dirItem of dirList) {
      const itemPath = resolve(dir, dirItem)
      const stats = await stat(itemPath)

      dirStats.set(itemPath, stats)
    }

    const watcher = watch(dir)

    watcher.on('change', async (_, fileName: string) => {
      const path = resolve(dir, fileName)

      try {
        const stats = await stat(path)
        const isDir = stats.isDirectory()

        if (!dirStats.has(path)) {
          results.push({ type: isDir ? 'ADD_DIR' : 'ADD_FILE', path })
        } else if (!isDir && dirStats.get(path)!.mtimeMs < stats.mtimeMs) {
          results.push({ type: 'CHANGE_FILE', path })
        }

        dirStats.set(path, stats)
      } catch (err) {
        if (err.code === 'ENOENT') {
          const isDir = dirStats.get(path)!.isDirectory()

          results.push({ type: isDir ? 'REMOVE_DIR' : 'REMOVE_FILE', path })
          dirStats.delete(path)
        } else {
          throw err
        }
      }

      if (resolver !== null) {
        resolver(results)

        results = []
        resolver = null
      }
    })

    watcher.once('error', (err) => {
      // if there is a pull-Promise already then reject it
      if (rejecter !== null) {
        rejecter(err)

        rejecter = null
      // otherwise store error to be thrown later
      } else {
        hasError = true
        error = err
      }
    })

    try {
      while (true) {
        // eslint-disable-next-line no-loop-func
        yield* await new Promise<TWatchEvent[]>((resolve, reject) => {
          // if there was an error since the last pull then throw it
          if (hasError) {
            reject(error)

            return
          }

          // if there were results since the last pull then resolve them
          if (results.length > 0) {
            resolve(results)

            results = []

            return
          }

          // otherwise just wait
          resolver = resolve
          rejecter = reject
        })
      }
    } catch (err) {
      if (err === cancelToken.symbol) {
        return
      }

      throw err
    } finally {
      watcher.close()
      dirStats.clear()
    }
  },
})

// const scanDir = async (dir: root) => {
//   const list = await readdir(dir)

// }

const watchDir = (rootDir: string): AsyncIterable<TWatchEvent> => ({
  async *[Symbol.asyncIterator]() {
    const queueNext = async (iterator: AsyncIterator<any>) => ({
      iterator,
      result: await iterator.next(),
    })
    const dirToIterator = new Map<string, AsyncIterator<TWatchEvent>>()
    const sources = new Map<AsyncIterator<TWatchEvent>, Promise<{iterator: AsyncIterator<TWatchEvent>, result: IteratorResult<TWatchEvent> }>>()
    const dirToCancel = new Map<string, TCancelFn>()

    const addDirToWatch = (dir: string) => {
      const { cancel, token } = createCancelToken()
      const it = watchIt(dir, token)
      const iterator = it[Symbol.asyncIterator]()

      sources.set(iterator, queueNext(iterator))
      dirToCancel.set(dir, cancel)
      dirToIterator.set(dir, iterator)
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
      const { value } = winner.result

      if (value.type === 'ADD_DIR') {
        addDirToWatch(value.path)
      } else if (value.type === 'REMOVE_DIR') {
        removeDirFromWatch(value.path)
      }

      sources.set(winner.iterator, queueNext(winner.iterator))

      yield value
    }
  },
})

const rootDir = resolve('tmp/watch')

for await (const e of watchDir(rootDir)) {
  console.log(e)
}

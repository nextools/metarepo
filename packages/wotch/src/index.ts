import { watch } from 'fs'
import { readdir, lstat } from 'fs/promises'
import { resolve } from 'path'
import { createCancelToken } from './create-cancel-token'
import type { TCancelFn, TCancelToken, TWatchEvent } from './types'

const excludes = ['.DS_Store']

const watchIt = (dir: string, cancelToken: TCancelToken): AsyncIterable<TWatchEvent> => ({
  async *[Symbol.asyncIterator]() {
    const dirMap = new Map<string, boolean>()
    const dirList = await readdir(dir, { withFileTypes: true })
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

    for (const dirent of dirList) {
      const path = resolve(dir, dirent.name)
      const isDir = dirent.isDirectory()

      results.push({ type: isDir ? 'ADD_DIR' : 'ADD_FILE', path })
      dirMap.set(dirent.name, isDir)
    }

    const watcher = watch(dir)

    watcher.on('change', async (_, fileName: string) => {
      if (excludes.includes(fileName)) {
        return
      }

      const path = resolve(dir, fileName)

      try {
        const stats = await lstat(path)
        const isDir = stats.isDirectory()

        if (dirMap.has(fileName)) {
          results.push({ type: 'CHANGE_FILE', path })
        } else {
          results.push({ type: isDir ? 'ADD_DIR' : 'ADD_FILE', path })
          dirMap.set(fileName, isDir)
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          const isDir = dirMap.get(fileName)!

          results.push({ type: isDir ? 'REMOVE_DIR' : 'REMOVE_FILE', path })
          dirMap.delete(fileName)
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
      dirMap.clear()
    }
  },
})

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

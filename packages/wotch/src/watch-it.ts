
import { watch } from 'fs'
import { readdir, lstat } from 'fs/promises'
import { join } from 'path'
import type { TCancelToken, TWatchEvent } from './types'

const EVENT_DELAY = 100

type TWatchItOptions = {
  dir: string,
  cancelToken: TCancelToken,
  isFileMatching: (path: string) => boolean,
  isDirMatching: (path: string) => boolean,
}

export const watchIt = (options: TWatchItOptions): AsyncIterable<TWatchEvent> => ({
  async *[Symbol.asyncIterator]() {
    // <fileName, isDir>
    const dirents = new Map<string, boolean>()
    let results: TWatchEvent[] = []
    let hasError = false
    let error: any
    let resolver: null | ((results: TWatchEvent[]) => void) = null
    let rejecter: null | ((error: any) => void) = null

    options.cancelToken.onCancel = () => {
      if (rejecter !== null) {
        rejecter(options.cancelToken.symbol)
      }
    }

    const dirList = await readdir(options.dir, { withFileTypes: true })

    // read dir to emit and store files first
    for (const dirent of dirList) {
      const path = join(options.dir, dirent.name)
      const isDir = dirent.isDirectory()

      if (isDir && !options.isDirMatching(path)) {
        continue
      }

      if (!isDir && !options.isFileMatching(path)) {
        continue
      }

      results.push({ type: isDir ? 'ADD_DIR' : 'ADD_FILE', path })
      dirents.set(dirent.name, isDir)
    }

    const watcher = watch(options.dir)
    let lastFileName: string
    let clearTimer: null | (() => void) = null

    watcher.on('change', async (_, fileName: string) => {
      if (clearTimer !== null) {
        // skip duplicated within EVENT_DELAY window events, happens at least on macOS
        if (fileName === lastFileName) {
          return
        }

        // or just resolve previously delayed event preemptively
        clearTimer()
      }

      lastFileName = fileName

      // delay event
      await new Promise<void>((resolve) => {
        const timerId = setTimeout(resolve, EVENT_DELAY)

        clearTimer = () => {
          clearInterval(timerId)
          resolve()
        }
      })

      const path = join(options.dir, fileName)

      clearTimer = null

      try {
        const stats = await lstat(path)
        const isDir = stats.isDirectory()

        if (isDir && !options.isDirMatching(path)) {
          return
        }

        if (!isDir && !options.isFileMatching(path)) {
          return
        }

        if (dirents.has(fileName)) {
          results.push({ type: 'CHANGE_FILE', path })
        } else {
          results.push({ type: isDir ? 'ADD_DIR' : 'ADD_FILE', path })
          dirents.set(fileName, isDir)
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          const isDir = dirents.get(fileName)!

          if (isDir) {
            results.push({ type: 'REMOVE_DIR', path })
          }

          dirents.delete(fileName)
        } else {
          throw err
        }
      }

      if (resolver !== null) {
        resolver(results)

        results = []
        resolver = null
        rejecter = null
      }
    })

    watcher.once('error', (err) => {
      // if there is a pull-Promise already then reject it
      if (rejecter !== null) {
        rejecter(err)

        resolver = null
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
      if (err === options.cancelToken.symbol) {
        return
      }

      throw err
    } finally {
      watcher.close()
      dirents.clear()
    }
  },
})

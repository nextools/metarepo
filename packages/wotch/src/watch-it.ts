
import { watch } from 'fs'
import { readdir, lstat } from 'fs/promises'
import { resolve } from 'path'
import type { TCancelToken, TWatchEvent } from './types'

const excludes = ['.DS_Store']
const EVENT_DELAY = 100

export const watchIt = (dir: string, cancelToken: TCancelToken): AsyncIterable<TWatchEvent> => ({
  async *[Symbol.asyncIterator]() {
    const dirMap = new Map<string, boolean>()
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

    const dirList = await readdir(dir, { withFileTypes: true })

    // read dir to emit and store files first
    for (const dirent of dirList) {
      if (excludes.includes(dirent.name)) {
        continue
      }

      const path = resolve(dir, dirent.name)
      const isDir = dirent.isDirectory()

      results.push({ type: isDir ? 'ADD_DIR' : 'ADD_FILE', path })
      dirMap.set(dirent.name, isDir)
    }

    const watcher = watch(dir)
    let lastFileName: string
    let clearTimer: null | (() => void) = null

    watcher.on('change', async (_, fileName: string) => {
      if (excludes.includes(fileName)) {
        return
      }

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

      clearTimer = null

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

          if (isDir) {
            results.push({ type: 'REMOVE_DIR', path })
          }

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

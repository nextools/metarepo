import path from 'path'
import chokidar from 'chokidar'

export type TWatchResult = {
  event: string,
  path: string,
}

export type TWatchEvent = 'change' | 'add' | 'addDir' | 'unlink' | 'unlinkDir'

export type TWatchOptions = {
  events?: TWatchEvent[],
}

export const watch = (dir: string, options?: TWatchOptions): AsyncIterable<TWatchResult> => {
  const opts = {
    events: ['change', 'add', 'addDir', 'unlink', 'unlinkDir'],
    ...options,
  }

  return {
    async *[Symbol.asyncIterator]() {
      const watcher = chokidar.watch(dir, {
        disableGlobbing: true,
        ignoreInitial: true,
      })

      try {
        while (true) {
          yield new Promise<TWatchResult>((resolve, reject) => {
            watcher.once('error', reject)

            for (const event of opts.events) {
              watcher.once(event, (path) => {
                watcher.removeAllListeners()
                resolve({ event, path })
              })
            }
          })
        }
      } finally {
        await watcher.close()
      }
    },
  }
}

export const main = async () => {
  const dir = path.resolve('tmp/wotch')
  const watcher = watch(dir, {
    events: ['add', 'change'],
  })

  for await (const result of watcher) {
    console.log(result)
  }
}

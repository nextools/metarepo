import chokidar from 'chokidar'
import type { TWatchPathOptions, TWatchPathResult } from './types'

export const watchPath = (path: string, options?: TWatchPathOptions): AsyncIterable<TWatchPathResult> => {
  const opts = {
    events: ['change', 'add', 'addDir', 'unlink', 'unlinkDir'],
    atomicPollInverval: 100,
    writeStabilityThreshold: 300,
    writePollInterval: 100,
    pollingInterval: 100,
    pollingBinaryInterval: 300,
    shouldUsePolling: false,
    shouldIgnorePermissionErrors: false,
    shouldIgnoreInitialEvents: false,
    shouldFollowSymlinks: false,
    ...options,
  }

  return {
    async *[Symbol.asyncIterator]() {
      const watcher = chokidar.watch(path, {
        awaitWriteFinish: {
          stabilityThreshold: opts.writeStabilityThreshold,
          pollInterval: opts.writePollInterval,
        },
        atomic: opts.atomicPollInverval,
        interval: opts.pollingBinaryInterval,
        binaryInterval: opts.pollingBinaryInterval,
        disableGlobbing: true,
        ignoreInitial: opts.shouldIgnoreInitialEvents,
        usePolling: opts.shouldUsePolling,
        ignorePermissionErrors: opts.shouldIgnorePermissionErrors,
        followSymlinks: opts.shouldFollowSymlinks,
      })
      let hasError = false
      let error: Error | null = null
      let pool: TWatchPathResult[] = []
      let resolver: ((results: TWatchPathResult[]) => void) | null = null
      let rejecter: ((err: Error) => void) | null = null

      watcher.on('error', (err) => {
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

      for (const event of opts.events) {
        watcher.on(event, (path) => {
          // store results
          pool.push({ event, path })

          // if there is a pull-Promise already then resolve it
          if (resolver !== null) {
            resolver(pool)

            pool = []
            resolver = null
          }
        })
      }

      try {
        while (true) {
          const results = await new Promise<TWatchPathResult[]>((resolve, reject) => {
            // if there was an error since the last pull then throw it
            if (hasError) {
              return reject(error)
            }

            // if there were results since the last pull then resolve it
            if (pool.length > 0) {
              resolve(pool)

              pool = []

              return
            }

            // otherwise just wait
            resolver = resolve
            rejecter = reject
          })

          for await (const result of results) {
            // if error has happened during pulling
            if (hasError) {
              throw error
            }

            yield result
          }
        }
      } finally {
        await watcher.close()
      }
    },
  }
}

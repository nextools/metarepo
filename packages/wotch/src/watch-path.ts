import chokidar from 'chokidar'
import { pipe } from 'funcom'
import { mapAsync } from 'iterama'
import { mergeAsync } from './merge-async'
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

      try {
        while (true) {
          yield new Promise<TWatchPathResult>((resolve, reject) => {
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
  const { matchGlobs } = await import('iva')

  const res = pipe(
    mapAsync<string, AsyncIterable<TWatchPathResult>>((p) => watchPath(p)),
    mergeAsync
  )(matchGlobs(['packages/nocean/*.md']))

  for await (const r of res) {
    console.log(r)
  }
}

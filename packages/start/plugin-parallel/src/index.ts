import plugin from '@start/plugin'

export type Options = {
  maxProcesses?: number,
}

export default (taskNames: string[], options: Options = {}) => (...args: string[]) =>
  plugin('parallel', () => async () => {
    const { Worker } = await import('worker_threads')
    const { default: pAll } = await import('p-all')

    const pAllOptions = {
      concurrency: options.maxProcesses ?? Infinity,
    }

    await pAll(
      taskNames.map((taskName) => () => new Promise<void>((resolve, reject) => {
        const worker = new Worker(require.resolve('./worker'), {
          workerData: {
            cliPath: process.argv[1],
            taskName,
            args,
          },
        })

        worker.on('error', () => {
          reject(null)
        })

        worker.on('exit', (code) => {
          if (code > 0) {
            reject(null)
          } else {
            resolve()
          }
        })
      })),
      pAllOptions
    )
  })

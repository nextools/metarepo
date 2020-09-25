import plugin from '@start/plugin'

export type Options = {
  maxProcesses?: number,
}

export default (taskName: string, options: Options = {}) => (...args: string[]) =>
  plugin('xargs', () => async () => {
    const { Worker } = await import('worker_threads')
    const { default: pAll } = await import('p-all')

    const pAllOptions = {
      concurrency: options.maxProcesses ?? Infinity,
    }

    await pAll(
      args.map((arg) => () => new Promise((resolve, reject) => {
        const worker = new Worker(require.resolve('./worker'), {
          workerData: {
            cliPath: process.argv[1],
            taskName,
            arg,
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
      }), pAllOptions)
    )
  })

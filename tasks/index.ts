// import type { TFileWithData } from './types'

import type { TJsonValue } from 'typeon'

export const buildFile = async (filePath: string) => {
  const { pipeAsync } = await import('funcom')
  const { read } = await import('./read')
  const { write } = await import('./write')

  return pipeAsync(
    read,
    write
  )(filePath)
}

export const build = async () => {
  const { mapAsync } = await import('iterama')
  const { piAllAsync } = await import('piall')
  const { connectToThreadPool } = await import('@tpool/client')
  const { find } = await import('./find')

  const sendToThreadPool = await connectToThreadPool({
    socketPath: '/tmp/start.sock',
  })

  const worker = <T extends TJsonValue, R>(fn: (arg: T) => Promise<R>) => (it: AsyncIterable<T>): AsyncIterable<R> => {
    const fnString = fn.toString()

    const mapped = mapAsync((arg: T) => async () => {
      const result = await sendToThreadPool<R>(arg)

      return result
    })(it)

    return piAllAsync(mapped, 8)
  }

  const pathIterable = find(['packages/re*/*.md'])

  return worker(async (filePath: string) => {
    const { pipeAsync } = await import('funcom')
    const { read } = await import('./read')
    const { write } = await import('./write')

    return pipeAsync(
      read,
      write
    )(filePath)
  })(pathIterable)
}

// export const build = async (workerify: (taskName: string) => (it: AsyncIterable<string>) => AsyncIterable<string>) => {
//   const { find } = await import('./find')
//   const { pipe } = await import('funcom')

//   const a = pipe(
//     find(['packages/re*/*.md']),
//     workerify('buildFile')
//   )

//   return a
// }

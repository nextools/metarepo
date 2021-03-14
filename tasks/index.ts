// import type { TFileWithData } from './types'

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
  const { find } = await import('./find')
  const { mapAsync } = await import('iterama')

  const worker = <T>(fn: (arg: T) => Promise<any>) => (it: AsyncIterable<T>): AsyncIterable<{ arg: T, fn: string }> => {
    const fnString = fn.toString()

    return mapAsync((arg: T) => ({
      arg,
      fn: fnString,
    }))(it)
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

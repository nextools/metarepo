import type { Worker } from 'worker_threads'
import { find } from './find'
import { read } from './read'
import { write } from './write'

export const buildFile = async (filePath: string) => {
  const { pipeAsync } = await import('funcom')

  return pipeAsync(
    read,
    write
  )(filePath)
}

export const build = async (workers: Worker[]) => {
  const { mapAsync } = await import('iterama')
  const { once } = await import('wans')
  const { piAllAsync } = await import('piall')

  const pathIterable = await find(['packages/re*/*.md'])
  let i = -1

  const mapper = (filePath: string) => async (): Promise<string> => {
    i++

    workers[i].postMessage({
      taskName: 'buildFile',
      value: filePath,
    })

    await once(workers[i], 'message')

    return filePath
  }
  const mapped = mapAsync(mapper)(pathIterable)
  const pit = piAllAsync(mapped, workers.length)

  for await (const p of pit) {
    // console.log('tick')
  }
}

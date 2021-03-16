const buildIt = async (it: AsyncIterable<string>) => {
  const { pipeAsync } = await import('funcom')
  const { read } = await import('./read')
  const { write } = await import('./write')

  return pipeAsync(
    read,
    write
  )(it)
}

export const build = async () => {
  const { pipeAsync } = await import('funcom')
  const { pipeThreadPool } = await import('@tpool/client')
  const { find } = await import('./find')

  return pipeAsync(
    find(['packages/iterama/src/*.ts']),
    pipeThreadPool(buildIt, {
      pools: [
        'ws+unix:///tmp/start1.sock',
        'ws+unix:///tmp/start2.sock',
      ],
    })
  )
}

const buildFile = async (filePath: string) => {
  const { pipeAsync } = await import('funcom')
  const { read } = await import('./read')
  const { write } = await import('./write')

  return pipeAsync(
    read,
    write
  )(filePath)
}

export const build = async () => {
  const { pipeAsync } = await import('funcom')
  const { mapThreadPool } = await import('@tpool/client')
  const { find } = await import('./find')

  return pipeAsync(
    find(['packages/iterama/src/*.ts']),
    mapThreadPool(buildFile, { socketPath: '/tmp/start.sock' })
  )
}

const buildIt = async (iterable: AsyncIterable<string>) => {
  const { pipeAsync } = await import('funcom')
  const { read } = await import('./read')
  const { rename } = await import('./rename')
  const { babel } = await import('./babel')
  const { babelConfigBuildNode } = await import('./babel-config')
  const { write } = await import('./write')

  return pipeAsync(
    read,
    babel(babelConfigBuildNode),
    rename((path) => path.replace(/\.tsx?$/, '.js')),
    write('packages/iterama/build/')
  )(iterable)
}

const groupByAsync = (num: number) => <T>(it: AsyncIterable<T>): AsyncIterable<T[]> => ({
  async *[Symbol.asyncIterator]() {
    const iterator = it[Symbol.asyncIterator]()
    let isDone = false
    let buf: T[] = []

    while (!isDone) {
      for (let i = 0; i < num; i++) {
        const result = await iterator.next()

        isDone = result.done === true

        if (isDone) {
          break
        }

        buf.push(result.value)
      }

      if (buf.length > 0) {
        yield buf

        buf = []
      }
    }
  },
})

export const build = async () => {
  const { pipeAsync } = await import('funcom')
  const { pipeThreadPool } = await import('@tpool/client')
  const { find } = await import('./find')
  const { remove } = await import('./remove')

  return pipeAsync(
    find(['packages/iterama/build']),
    remove,
    find(['packages/iterama/src/*.ts']),
    // buildIt
    pipeThreadPool(buildIt, {
      pools: [
        'ws+unix:///tmp/start1.sock',
        // 'ws://localhost:8000',
      ],
    })
  )
}

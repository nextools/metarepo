import type { TTask } from './types'

export const remove: TTask<string, string> = async (iterable) => {
  const { mapAsync } = await import('iterama/mapAsync')
  const { default: dleet } = await import('dleet')

  return mapAsync(async (path: string) => {
    await dleet(path)

    return path
  })(iterable)
}

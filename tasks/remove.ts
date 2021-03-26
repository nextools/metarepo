import type { TPlugin } from './types'

export const remove: TPlugin<string, string> = async function* (it) {
  const { mapAsync } = await import('iterama')
  const { default: dleet } = await import('dleet')

  yield* mapAsync(async (path: string) => {
    await dleet(path)

    return path
  })(it)
}

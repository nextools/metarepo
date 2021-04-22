import type { TPlugin } from '@start/types'

export const remove: TPlugin<string, string> = async function* (it) {
  const { default: dleet } = await import('dleet')

  for await (const path of it) {
    await dleet(path)

    yield path
  }
}

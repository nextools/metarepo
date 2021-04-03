import type { TPlugin } from './types'

export const log = (name: string): TPlugin<any, any> => async function* (it) {
  const { forEachAsync } = await import('iterama')

  let i = 0

  try {
    yield* forEachAsync(() => {
      i++
    })(it)

    console.log(`✅ ${name}: ${i}`)
  } catch (err) {
    console.log(`❌ ${name}: ${i}`)
    throw err
  }
}

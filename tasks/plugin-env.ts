import type { TPlugin } from '@start/types'
import { iterateObjectEntries } from 'itobj'

export const env = (env: NodeJS.ProcessEnv): TPlugin<any, any> => async function* (it) {
  for (const [key, value] of iterateObjectEntries(env)) {
    process.env[key] = value
  }

  yield* it
}

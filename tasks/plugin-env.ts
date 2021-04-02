import { iterateObjectEntries } from 'itobj'
import type { TPlugin } from './types'

export const env = (env: NodeJS.ProcessEnv): TPlugin<any, any> => async function* (it) {
  for (const [key, value] of iterateObjectEntries(env)) {
    process.env[key] = value
  }

  yield* it
}

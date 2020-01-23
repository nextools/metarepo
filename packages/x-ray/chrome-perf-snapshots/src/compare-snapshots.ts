import { getObjectKeys } from 'tsfn'
import { COMPARE_THRESHOLD } from './utils'
import { TPerfResult } from './types'

export const compareSnapshots = (existing: TPerfResult, next: TPerfResult): boolean => {
  let hasPassed = true

  for (const key of getObjectKeys(existing)) {
    const diffValue = Math.round((next[key] - existing[key]) * 100 * 1000 / existing[key]) / 1000

    if (Math.abs(next[key] - existing[key]) >= existing[key] * COMPARE_THRESHOLD) {
      console.log('diff:', key, `${diffValue > 0 ? `+${diffValue}` : diffValue}%`)

      hasPassed = false
    } else {
      console.log('ok:', key, `${diffValue > 0 ? `+${diffValue}` : diffValue}%`)
    }
  }

  return hasPassed
}

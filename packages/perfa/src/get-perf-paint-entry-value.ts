import { isUndefined } from 'tsfn'
import { TPerfPaint } from './types'

export const getPerfPaintEntryValue = (perf: TPerfPaint, key: string): number => {
  const entry = perf.find((entry) => entry.name === key)

  if (isUndefined(entry)) {
    return 0
  }

  return entry.startTime
}

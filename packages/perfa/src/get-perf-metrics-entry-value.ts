import { isUndefined } from 'tsfn'
import { TPerfMetrics } from './types'

export const getPerfMetricsEntryValue = (perf: TPerfMetrics, key: string): number => {
  const entry = perf.metrics.find((entry) => entry.name === key)

  if (isUndefined(entry)) {
    return 0
  }

  return entry.value
}

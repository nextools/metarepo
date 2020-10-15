import plugin from '@start/plugin'
import type { CoverageMapData } from 'istanbul-lib-coverage'
import type { ReportNode } from 'istanbul-lib-report'

export type TOptions = {
  branches?: number,
  functions?: number,
  lines?: number,
  statements?: number,
}

export default (options: TOptions) =>
  plugin('istanbulThresholds', ({ logMessage }) => async () => {
    const { createCoverageMap } = await import('istanbul-lib-coverage')
    const { createSourceMapStore } = await import('istanbul-lib-source-maps')
    // @ts-ignore
    const { default: SummarizerFactory } = await import('istanbul-lib-report/lib/summarizer-factory')
    const { getObjectKeys, isUndefined } = await import('tsfn')
    const hooks = await import('./hooks')
    const { default: coverageVariable } = await import('./variable')

    hooks.clearAll()

    const coverageMapData = (global as any)[coverageVariable] as CoverageMapData | undefined

    if (isUndefined(coverageMapData)) {
      logMessage('no coverage information was collected')

      return
    }

    const coverageMap = createCoverageMap(coverageMapData)
    const sourceMapStore = createSourceMapStore()
    const remappedCoverageMap = await sourceMapStore.transformCoverage(coverageMap)

    const summarizer = new SummarizerFactory(remappedCoverageMap)
    const reporterNode = summarizer.flat.getRoot() as ReportNode
    const coverageSummary = reporterNode.getCoverageSummary(true).data

    const result = getObjectKeys(options).reduce((errors, key) => {
      const threshold = options[key] as number
      const summary = coverageSummary[key]

      // check percentage threshold
      if (threshold > 0) {
        if (summary.pct < threshold) {
          return errors.concat(`${key} percentage: ${summary.pct}% < ${threshold}%`)
        }
      }

      // check gap threshold
      if (threshold < 0) {
        if (summary.covered - summary.total < threshold) {
          return errors.concat(`${key} gap: ${summary.covered} - ${summary.total} < ${threshold}`)
        }
      }

      return errors
    }, [] as string[])

    if (result.length > 0) {
      throw result
    }
  })

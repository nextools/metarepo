import plugin from '@start/plugin'
import type { CoverageMapData } from 'istanbul-lib-coverage'
import type { ReportType } from 'istanbul-reports'

export default (formats: ReportType[] = ['lcovonly', 'text-summary']) =>
  plugin('istanbulReport', ({ logMessage }) => async () => {
    const { createCoverageMap } = await import('istanbul-lib-coverage')
    const { createSourceMapStore } = await import('istanbul-lib-source-maps')
    const { createContext } = await import('istanbul-lib-report')
    const { create: createReporter } = await import('istanbul-reports')
    const { isUndefined } = await import('tsfn')
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

    const context = createContext({
      dir: 'coverage/',
      defaultSummarizer: 'nested',
      coverageMap: remappedCoverageMap,
    })

    logMessage(formats.join(', '))

    formats.forEach((format) => {
      // @ts-ignore
      createReporter(format).execute(context)
    })
  })

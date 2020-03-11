import plugin from '@start/plugin'
import { CoverageMapData } from 'istanbul-lib-coverage'

export default (formats: string[] = ['lcovonly', 'text-summary']) =>
  plugin('istanbulReport', ({ logMessage }) => async () => {
    const { createCoverageMap } = await import('istanbul-lib-coverage')
    const { createSourceMapStore } = await import('istanbul-lib-source-maps')
    // @ts-ignore
    const { createReporter } = await import('istanbul-api')
    const hooks = await import('./hooks')
    const { default: coverageVariable } = await import('./variable')

    hooks.clearAll()

    const coverageMapData = (global as any)[coverageVariable] as CoverageMapData

    if (!coverageMapData) {
      logMessage('no coverage information was collected')

      return
    }

    const coverageMap = createCoverageMap(coverageMapData)
    const sourceMapStore = createSourceMapStore()
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const remappedCoverageMap = await sourceMapStore.transformCoverage(coverageMap)
    const reporter = createReporter()

    logMessage(formats.join(', '))

    formats.forEach((format) => {
      reporter.add(format)
      reporter.write(remappedCoverageMap, {})
    })
  })

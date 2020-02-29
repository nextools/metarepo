import plugin from '@start/plugin'
import { Config } from '@jest/types'

export default (argv?: Config.Argv) =>
  plugin('jest', () => async () => {
    const { runCLI } = await import('@jest/core')
    const projects = argv?.projects || [argv?.rootDir || process.cwd()]
    const result = await runCLI(argv || {} as Config.Argv, projects)

    if (
      result.results.numFailedTests > 0 ||
      result.results.numFailedTestSuites > 0 ||
      result.results.numTotalTests === 0
    ) {
      throw null
    }
  })

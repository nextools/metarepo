import { Session } from 'inspector'
import type { Profiler } from 'inspector'
import { promisify } from 'util'

// promisify doesn't work properly with all those overloads
type TSessionPost = {
  (cmd: 'Profiler.enable'): Promise<void>,
  (cmd: 'Profiler.startPreciseCoverage', options?: Profiler.StartPreciseCoverageParameterType): Promise<void>,
  (cmd: 'Profiler.takePreciseCoverage'): Promise<Profiler.TakePreciseCoverageReturnType>,
  (cmd: 'Profiler.stopPreciseCoverage'): Promise<void>,
  (cmd: 'Profiler.disable'): Promise<void>,
}

export const startCollectingCoverage = async (): Promise<() => Promise<Profiler.ScriptCoverage[]>> => {
  const session = new Session()

  session.connect()

  const sessionPost = promisify(session.post.bind(session)) as any as TSessionPost

  await sessionPost('Profiler.enable')
  await sessionPost('Profiler.startPreciseCoverage', {
    callCount: true,
    detailed: true,
  })

  return async () => {
    const { result } = await sessionPost('Profiler.takePreciseCoverage')

    await sessionPost('Profiler.stopPreciseCoverage')
    await sessionPost('Profiler.disable')

    session.disconnect()

    return result
  }
}

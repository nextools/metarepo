import plugin, { StartPlugin } from '@start/plugin'
import { TPluginData } from '@auto/start-plugin'

export type StartPluginOrFalse<P, R> = StartPlugin<P, R> | false

const PORT = 4873
const URL = `http://localhost:${PORT}`
const RETRY_TIMEOUT = 500

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout))

export default (configPath: string) =>
  plugin<TPluginData, any>('run-verdaccio', ({ logMessage }) => async (props) => {
    const { default: execa } = await import('execa')
    const { default: fetch } = await import('node-fetch')

    execa(
      'docker',
      [
        'run',
        '--rm',
        '--name',
        'npm',
        '-p',
        `${PORT}:${PORT}`,
        '-v',
        `${configPath}:/verdaccio/conf/config.yaml`,
        'verdaccio/verdaccio',
      ]
    )

    const isVerdaccioUp = async () => {
      try {
        await fetch(URL)

        return true
      } catch {
        return false
      }
    }

    while (!(await isVerdaccioUp())) {
      await sleep(RETRY_TIMEOUT)
    }

    logMessage(URL)

    return props
  })

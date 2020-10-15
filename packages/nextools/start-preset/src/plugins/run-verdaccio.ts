import plugin from '@start/plugin'

const PORT = 4873
const URL = `http://localhost:${PORT}`
const RETRY_TIMEOUT = 500

export default (configPath: string) =>
  plugin<{}, any>('run-verdaccio', ({ logMessage }) => async () => {
    const { spawnChildProcessStream } = await import('spown')
    const { sleep } = await import('sleap')
    const { default: fetch } = await import('node-fetch')

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    spawnChildProcessStream(
      `docker run --rm --name npm -p ${PORT}:${PORT} -v ${configPath}:/verdaccio/conf/config.yaml verdaccio/verdaccio`,
      {
        stdout: null,
        stderr: process.stderr,
      }
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
  })

import { spawnChildProcess } from 'spown'

export const getPortProcess = async (port: number, host: string): Promise<number | null> => {
  try {
    const { stdout: pid } = await spawnChildProcess(`lsof -ti @${host}:${port} -sTCP:LISTEN`)

    return Number(pid)
  } catch (e) {
    if (e.exitCode === 1 && e.message.length === 0) {
      return null
    }

    throw e
  }
}

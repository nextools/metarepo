import { spawnChildProcess } from 'spown'
import { getPortProcess } from './get-port-process'

export const killPortProcess = async (port: number, host: string): Promise<number | null> => {
  const pid = await getPortProcess(port, host)

  if (pid !== null) {
    await spawnChildProcess(`kill -9 ${pid}`, { stdout: null })
  }

  return pid
}

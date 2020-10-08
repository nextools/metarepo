import { sleep } from 'sleap'
import { checkPort } from './check-port'

const RETRY_TIMEOUT = 200

export const waitForPort = async (port: number, host: string): Promise<void> => {
  let isPortFree = true

  do {
    isPortFree = await checkPort(port, host)

    if (isPortFree) {
      await sleep(RETRY_TIMEOUT)
    }
  } while (isPortFree)
}

import { sleep } from 'sleap'
import { isPortFree } from './is-port-free'

const RETRY_TIMEOUT = 200

export const waitForPort = async (port: number, host: string): Promise<void> => {
  let isFree = true

  do {
    isFree = await isPortFree(port, host)

    if (isFree) {
      await sleep(RETRY_TIMEOUT)
    }
  } while (isFree)
}

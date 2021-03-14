import { parentPort, threadId } from 'worker_threads'
import { getRandomInt } from 'rndi'
import { sleep } from 'sleap'
import { once } from 'wans'

while (true) {
  const message = await once(parentPort, 'message')

  try {
    await sleep(getRandomInt(100, 1000))

    parentPort.postMessage({
      type: 'DONE',
      value: `${threadId}: ${message}`,
    })
  } catch (err) {
    parentPort.postMessage({
      type: 'ERROR',
      value: err instanceof Error ? err.message : err,
    })
  }
}

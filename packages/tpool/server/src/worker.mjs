import { parentPort, threadId } from 'worker_threads'
import { getRandomInt } from 'rndi'
import { sleep } from 'sleap'
import { once } from 'wans'

while (true) {
  const { arg, fnString } = await once(parentPort, 'message')
  // eslint-disable-next-line no-new-func
  const fn = new Function(`return ${fnString}`)()

  try {
    await sleep(getRandomInt(100, 1000))

    parentPort.postMessage({
      type: 'DONE',
      value: `${threadId}: ${arg}`,
    })
  } catch (err) {
    parentPort.postMessage({
      type: 'ERROR',
      value: err instanceof Error ? err.message : err,
    })
  }
}

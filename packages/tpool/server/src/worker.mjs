import { parentPort, threadId } from 'worker_threads'
import { getRandomInt } from 'rndi'
import { sleep } from 'sleap'
import { once } from 'wans'

while (true) {
  try {
    const { arg, fnString } = await once(parentPort, 'message')
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return ${fnString}`)()

    await sleep(getRandomInt(100, 1000))

    parentPort.postMessage({
      type: 'DONE',
      value: `${threadId}: ${arg}`,
    })
  } catch (err) {
    parentPort.postMessage({
      type: 'ERROR',
      value: err.stack ?? err,
    })
  }
}

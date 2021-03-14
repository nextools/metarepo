import { parentPort, threadId } from 'worker_threads'
import { getRandomInt } from 'rndi'
import { sleep } from 'sleap'
import { once } from 'wans'

while (true) {
  const message = await once(parentPort, 'message')

  await sleep(getRandomInt(100, 1000))

  console.log(threadId, message)

  parentPort.postMessage('done')
}

import { workerData, parentPort, threadId } from 'worker_threads'
import { once } from 'wans'

const { tasksFilePath } = workerData
const tasks = await import(tasksFilePath)

while (true) {
  const { taskName, value } = await once(parentPort, 'message')

  await tasks[taskName](value)

  console.log('worker', threadId, value)
  parentPort.postMessage('done')
}

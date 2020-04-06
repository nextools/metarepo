import { parentPort } from 'worker_threads'

parentPort?.on('message', async (dataArr: Uint8Array) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const dataString = new TextDecoder('utf-8').decode(dataArr)
    const data = JSON.parse(dataString)

    parentPort?.postMessage({
      type: 'done',
      value: data,
    })
  } catch (error) {
    const value = error instanceof Error ? error.message : error

    parentPort?.postMessage({ type: 'error', value })
  }
})

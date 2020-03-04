const { workerData, parentPort } = require('worker_threads')

const fn = require(workerData.fnFilePath)[workerData.fnName]

parentPort.on('message', async (items) => {
  try {
    await Promise.all(
      items.map(async (item) => {
        const result = await fn(item, ...workerData.fnArgs)

        parentPort.postMessage({ type: 'data', value: result })
      })
    )

    parentPort.postMessage({ type: 'next' })
  } catch (e) {
    parentPort.postMessage({ type: 'error', value: e instanceof Error ? e.message : e })
  }
})

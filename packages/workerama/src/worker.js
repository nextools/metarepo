const { workerData, parentPort } = require('worker_threads')

const fnPromise = require(workerData.fnFilePath)[workerData.fnName](...workerData.fnArgs)

parentPort.on('message', async (items) => {
  try {
    await Promise.all(
      items.map(async (item) => {
        const fn = await fnPromise
        const result = await fn(item)

        parentPort.postMessage({ type: 'data', value: result.value }, result.transferList)
      })
    )

    parentPort.postMessage({ type: 'next' })
  } catch (e) {
    parentPort.postMessage({ type: 'error', value: e instanceof Error ? e.message : e })
  }
})

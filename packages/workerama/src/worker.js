const { workerData, parentPort } = require('worker_threads')

const fnPromise = require(workerData.fnFilePath)[workerData.fnName](...workerData.fnArgs)

parentPort.on('message', async (item) => {
  try {
    const fn = await fnPromise
    const result = await fn(item)

    parentPort.postMessage(
      { type: 'done', value: result.value },
      result.transferList
    )
  } catch (e) {
    parentPort.postMessage({
      id,
      type: 'error',
      value: e instanceof Error ? e.message : e,
    })
  }
})

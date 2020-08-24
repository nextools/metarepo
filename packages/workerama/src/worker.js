const { workerData, parentPort } = require('worker_threads')

const { fnFilePath, fnName, fnArgs } = workerData

const fnPromise = require(fnFilePath)[fnName](...fnArgs)

parentPort.on('message', async (item) => {
  try {
    const fn = await fnPromise

    if (item.done) {
      await fn(item)

      process.exit()
    }

    const { value, transferList } = await fn(item)

    parentPort.postMessage({ type: 'done', value }, transferList)
  } catch (error) {
    const value = error instanceof Error ? error.message : error

    parentPort.postMessage({ type: 'error', value })
  }
})

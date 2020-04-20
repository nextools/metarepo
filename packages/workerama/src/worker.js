const { workerData, parentPort } = require('worker_threads')

const { umask, fnFilePath, fnName, fnArgs } = workerData

// https://github.com/nodejs/node/issues/25448
// https://github.com/nodejs/node/pull/25526
process.umask = () => umask

const fnPromise = require(fnFilePath)[fnName](...fnArgs)

parentPort.on('message', async (item) => {
  try {
    const fn = await fnPromise
    const { value, transferList } = await fn(item)

    parentPort.postMessage({ type: 'done', value }, transferList)
  } catch (error) {
    console.error(error)

    const value = error instanceof Error ? error.message : error

    parentPort.postMessage({ type: 'error', value })
  }
})

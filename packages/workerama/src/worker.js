const { workerData, parentPort } = require('worker_threads')

const fnPromise = require(workerData.fnFilePath)[workerData.fnName](...workerData.fnArgs)

const isObject = (value) => Object.prototype.toString.call(value) === '[object Object]'

parentPort.on('message', async (items) => {
  try {
    await Promise.all(
      items.map(async (item) => {
        const fn = await fnPromise
        const result = await fn(item)

        if (isObject(result) && Reflect.has(result, 'buffer') && result.buffer instanceof ArrayBuffer) {
          parentPort.postMessage({ type: 'data', value: result }, [result.buffer])
        } else {
          parentPort.postMessage({ type: 'data', value: result })
        }
      })
    )

    parentPort.postMessage({ type: 'next' })
  } catch (e) {
    parentPort.postMessage({ type: 'error', value: e instanceof Error ? e.message : e })
  }
})

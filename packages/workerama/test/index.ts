import { Worker, WorkerOptions } from 'worker_threads'
import test from 'tape'
import { mock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'

const umask = process.umask()

test('workerama: `maxThreadCount`', async (t) => {
  const workerSpy = createSpy(() => {})

  class MyWorker extends Worker {
    constructor(file: string, options?: WorkerOptions) {
      super(file, options)
      workerSpy(file, options)
    }
  }

  const inputArray = new Array(20).fill(null).map((_, i) => i)
  const outputArray = [] as number[]

  const unmock = mock('../src', {
    worker_threads: {
      Worker: MyWorker,
    },
  })

  const { workerama } = await import('../src')

  const asyncIterable = workerama<number>({
    items: inputArray,
    maxThreadCount: 3,
    fnFilePath: './fixtures/ok',
    fnName: 'test',
    fnArgs: [1],
  })

  for await (const result of asyncIterable) {
    outputArray.push(result)
  }

  const expectedArray = inputArray.map((item) => item + 1)

  outputArray.sort((a, b) => a - b)

  const workerPath = require.resolve('../src/worker')
  const fnFilePath = require.resolve('./fixtures/ok')

  t.deepEqual(
    getSpyCalls(workerSpy),
    [
      [
        workerPath,
        {
          workerData: {
            fnFilePath,
            fnName: 'test',
            fnArgs: [1],
            umask,
          },
        },
      ],
      [
        workerPath,
        {
          workerData: {
            fnFilePath,
            fnName: 'test',
            fnArgs: [1],
            umask,
          },
        },
      ],
      [
        workerPath,
        {
          workerData: {
            fnFilePath,
            fnName: 'test',
            fnArgs: [1],
            umask,
          },
        },
      ],
    ],
    'should make workers'
  )

  t.deepEqual(
    outputArray,
    expectedArray,
    'should somehow work'
  )

  unmock()
})

test('workerama: not more than needed', async (t) => {
  const workerSpy = createSpy(() => {})

  class MyWorker extends Worker {
    constructor(file: string, options?: WorkerOptions) {
      super(file, options)
      workerSpy(file, options)
    }
  }

  const inputArray = new Array(10).fill(null).map((_, i) => i)
  const outputArray = [] as number[]

  const unmock = mock('../src', {
    worker_threads: {
      Worker: MyWorker,
    },
  })

  const { workerama } = await import('../src')

  const asyncIterable = workerama<number>({
    items: inputArray,
    maxThreadCount: 2,
    fnFilePath: './fixtures/ok',
    fnName: 'test',
    fnArgs: [1],
  })

  for await (const result of asyncIterable) {
    outputArray.push(result)
  }

  const expectedArray = inputArray.map((item) => item + 1)

  outputArray.sort((a, b) => a - b)

  const workerPath = require.resolve('../src/worker')
  const fnFilePath = require.resolve('./fixtures/ok')

  t.deepEqual(
    getSpyCalls(workerSpy),
    [
      [
        workerPath,
        {
          workerData: {
            fnFilePath,
            fnName: 'test',
            fnArgs: [1],
            umask,
          },
        },
      ],
      [
        workerPath,
        {
          workerData: {
            fnFilePath,
            fnName: 'test',
            fnArgs: [1],
            umask,
          },
        },
      ],
    ],
    'should make workers'
  )

  t.deepEqual(
    outputArray,
    expectedArray,
    'should somehow work'
  )

  unmock()
})

test('workerama: throw about `maxThreadCount`', async (t) => {
  const inputArray = new Array(10).fill(null).map((_, i) => i)

  const { workerama } = await import('../src')

  try {
    const asyncIterable = workerama({
      items: inputArray,
      maxThreadCount: 0,
      fnFilePath: './fixtures/ok',
      fnName: 'test',
      fnArgs: [1],
    })

    const iterator = asyncIterable[Symbol.asyncIterator]()

    await iterator.next()

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      '`maxThreadCount` should be greater than zero (tip: pass Infinity to set no limits)',
      'should throw'
    )
  }
})

test('workerama: should propagate and throw errors from workers', async (t) => {
  const inputArray = new Array(20).fill(null).map((_, i) => i)
  const { workerama } = await import('../src')
  const outputArray = [] as number[]

  try {
    const asyncIterable = workerama<number>({
      items: inputArray,
      maxThreadCount: 2,
      fnFilePath: './fixtures/error',
      fnName: 'test',
      fnArgs: [1],
    })

    for await (const result of asyncIterable) {
      outputArray.push(result)
    }

    t.fail('should not get here')
  } catch (e) {
    // console.log(outputArray)

    t.equal(
      e,
      'oops',
      'should throw'
    )
  }
})

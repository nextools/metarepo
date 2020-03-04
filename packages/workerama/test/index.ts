import { Worker, WorkerOptions } from 'worker_threads'
import test from 'blue-tape'
import { mock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'

test('tommy-gun: `maxThreadCount`', async (t) => {
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

  await workerama({
    items: inputArray,
    itemsPerThreadCount: 3,
    maxThreadCount: 3,
    fnFilePath: './fixtures/ok',
    fnName: 'test',
    fnArgs: [1],
    onItemResult: (result) => {
      outputArray.push(result)
    },
  })

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

test('tommy-gun: not more than needed', async (t) => {
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

  await workerama({
    items: inputArray,
    itemsPerThreadCount: 5,
    maxThreadCount: 3,
    fnFilePath: './fixtures/ok',
    fnName: 'test',
    fnArgs: [1],
    onItemResult: (result) => {
      outputArray.push(result)
    },
  })

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

test('tommy-gun: throw about `itemsPerThreadCount`', async (t) => {
  const inputArray = new Array(10).fill(null).map((_, i) => i)
  const outputArray = [] as number[]

  const { workerama } = await import('../src')

  try {
    await workerama({
      items: inputArray,
      itemsPerThreadCount: 0,
      maxThreadCount: 3,
      fnFilePath: './fixtures/ok',
      fnName: 'test',
      fnArgs: [1],
      onItemResult: (result) => {
        outputArray.push(result)
      },
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      '`itemsPerThreadCount` should be greater than zero',
      'should throw'
    )
  }
})

test('tommy-gun: throw about `maxThreadCount`', async (t) => {
  const inputArray = new Array(10).fill(null).map((_, i) => i)
  const outputArray = [] as number[]

  const { workerama } = await import('../src')

  try {
    await workerama({
      items: inputArray,
      itemsPerThreadCount: 3,
      maxThreadCount: 0,
      fnFilePath: './fixtures/ok',
      fnName: 'test',
      fnArgs: [1],
      onItemResult: (result) => {
        outputArray.push(result)
      },
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      '`maxThreadCount` should be greater than zero (tip: pass Infinity to set no limits)',
      'should throw'
    )
  }
})

test('tommy-gun: should propagate and throw errors from workers', async (t) => {
  const inputArray = new Array(20).fill(null).map((_, i) => i)
  const { workerama } = await import('../src')

  try {
    await workerama({
      items: inputArray,
      itemsPerThreadCount: 3,
      maxThreadCount: 3,
      fnFilePath: './fixtures/error',
      fnName: 'test',
      fnArgs: [1],
      onItemResult: () => {},
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e,
      'oops',
      'should throw'
    )
  }
})

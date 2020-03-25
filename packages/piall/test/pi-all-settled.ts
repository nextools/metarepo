import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { piAllSettled } from '../src/pi-all-settled'
import { waitFor } from './wait-for'

test('piAllSettled: 3 with concurrency 1', async (t) => {
  const resultSpy = createSpy(() => {})
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 1, 2], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAllSettled([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], 1)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [
      [{ status: 'fulfilled', value: 1 }],
      [{ status: 'fulfilled', value: 2 }],
      [{ status: 'fulfilled', value: 3 }],
    ],
    'should resolve in order'
  )
})

test('piAllSettled: 3 with concurrency 2', async (t) => {
  const resultSpy = createSpy(() => {})
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 1, 2], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAllSettled([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], 2)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [
      [{ status: 'fulfilled', value: 2 }],
      [{ status: 'fulfilled', value: 1 }],
      [{ status: 'fulfilled', value: 3 }],
    ],
    'should resolve in order'
  )
})

test('piAllSettled: 3 with concurrency 3', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAllSettled([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], 3)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [
      [{ status: 'fulfilled', value: 3 }],
      [{ status: 'fulfilled', value: 2 }],
      [{ status: 'fulfilled', value: 1 }],
    ],
    'should resolve in order'
  )
})

test('piAllSettled: 3 with concurrency 4', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAllSettled([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], 4)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [
      [{ status: 'fulfilled', value: 3 }],
      [{ status: 'fulfilled', value: 2 }],
      [{ status: 'fulfilled', value: 1 }],
    ],
    'should resolve in order'
  )
})

test('piAllSettled: 3 with infinite concurrency', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAllSettled([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], Infinity)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [
      [{ status: 'fulfilled', value: 3 }],
      [{ status: 'fulfilled', value: 2 }],
      [{ status: 'fulfilled', value: 1 }],
    ],
    'should resolve in order'
  )
})

test('piAllSettled: 3 with default concurrency', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAllSettled([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], Infinity)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [
      [{ status: 'fulfilled', value: 3 }],
      [{ status: 'fulfilled', value: 2 }],
      [{ status: 'fulfilled', value: 1 }],
    ],
    'should resolve in order'
  )
})

test('piAllSettled: sync reject', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2], index)

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAllSettled([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => Promise.reject('oops'),
    () => Promise.resolve(4),
  ], 3)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [
      [{ status: 'rejected', reason: 'oops' }],
      [{ status: 'fulfilled', value: 4 }],
      [{ status: 'fulfilled', value: 2 }],
      [{ status: 'fulfilled', value: 1 }],
    ],
    'should resolve with the rest of the sync queue'
  )
})

test('piAllSettled: async reject', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([2, 1, 2, 2], index)

    if (index === 2) {
      return Promise.reject('oops')
    }

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAllSettled([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
    () => promiseSpy(4),
  ], 2)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [
      [{ status: 'fulfilled', value: 2 }],
      [{ status: 'fulfilled', value: 1 }],
      [{ status: 'rejected', reason: 'oops' }],
      [{ status: 'fulfilled', value: 4 }],
    ],
    'should resolve in order'
  )
})

test('piAllSettled: iterable', async (t) => {
  const resultSpy = createSpy(() => {})
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 1, 2], index)

    return Promise.resolve(args[0])
  })
  const iterable = {
    *[Symbol.iterator]() {
      yield () => promiseSpy(1)
      yield () => promiseSpy(2)
      yield () => promiseSpy(3)
    },
  }
  const asyncIterable = piAllSettled(iterable, 2)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [
      [{ status: 'fulfilled', value: 2 }],
      [{ status: 'fulfilled', value: 1 }],
      [{ status: 'fulfilled', value: 3 }],
    ],
    'should resolve in order'
  )
})

test('piAllSettled: sync', async (t) => {
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAllSettled([
    () => 1,
    () => 2,
    () => 3,
  ], 2)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [
      [{ status: 'fulfilled', value: 1 }],
      [{ status: 'fulfilled', value: 2 }],
      [{ status: 'fulfilled', value: 3 }],
    ],
    'should resolve in order'
  )
})

test('piAllSettled: sync error', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([1, 1, 1], index)

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAllSettled([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => {
      throw 'oops'
    },
    () => 3,
    () => promiseSpy(4),
  ])

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [
      [{ status: 'rejected', reason: 'oops' }],
      [{ status: 'fulfilled', value: 3 }],
      [{ status: 'fulfilled', value: 1 }],
      [{ status: 'fulfilled', value: 2 }],
      [{ status: 'fulfilled', value: 4 }],
    ],
    'should resolve without the rest of the sync queue'
  )
})

test('piAllSettled: throw with negative concurrency', (t) => {
  try {
    piAllSettled([], -1)

    t.fail('should not get here')
  } catch (error) {
    t.equal(
      error.message,
      '`concurrency` argument must be a number >= 1',
      'should throw'
    )

    t.end()
  }
})

test('piAllSettled: throw with invalid concurrency', (t) => {
  try {
    piAllSettled(
      [],
      // @ts-ignore
      'two'
    )

    t.fail('should not get here')
  } catch (error) {
    t.equal(
      error.message,
      '`concurrency` argument must be a number >= 1',
      'should throw'
    )

    t.end()
  }
})

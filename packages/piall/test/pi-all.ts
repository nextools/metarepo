import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { piAll } from '../src/pi-all'
import { waitFor } from './wait-for'

test('piAll: 3 with concurrency 1', async (t) => {
  const resultSpy = createSpy(() => {})
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 1, 2], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], 1)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [[1], [2], [3]],
    'should resolve in order'
  )
})

test('piAll: 3 with concurrency 2', async (t) => {
  const resultSpy = createSpy(() => {})
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 1, 2], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], 2)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [[2], [1], [3]],
    'should resolve in order'
  )
})

test('piAll: 3 with concurrency 3', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], 3)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [[3], [2], [1]],
    'should resolve in order'
  )
})

test('piAll: 3 with concurrency 4', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], 4)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [[3], [2], [1]],
    'should resolve in order'
  )
})

test('piAll: 3 with infinite concurrency', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], Infinity)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [[3], [2], [1]],
    'should resolve in order'
  )
})

test('piAll: 3 with default concurrency', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ])

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [[3], [2], [1]],
    'should resolve in order'
  )
})

test('piAll: iterable', async (t) => {
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
  const asyncIterable = piAll(iterable, 2)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [[2], [1], [3]],
    'should resolve in order'
  )
})

test('piAll: sync reject', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([1, 1, 2], index)

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => Promise.reject('oops'),
    () => Promise.resolve(4),
    () => promiseSpy(5),
  ], 2)

  try {
    for await (const result of asyncIterable) {
      resultSpy(result)
    }
  } catch (error) {
    t.deepEqual(
      getSpyCalls(resultSpy),
      [[1], [2], [4]],
      'should resolve with the rest of the sync queue'
    )
  }
})

test('piAll: async reject', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([1, 2, 2, 2], index)

    if (index === 2) {
      return Promise.reject('oops')
    }

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
    () => promiseSpy(4),
  ], 2)

  try {
    for await (const result of asyncIterable) {
      resultSpy(result)
    }

    t.fail('should not get here')
  } catch (error) {
    t.deepEqual(
      getSpyCalls(resultSpy),
      [[1], [2]],
      'should resolve in order'
    )

    t.equal(
      error,
      'oops',
      'should throw'
    )
  }
})

test('piAll: sync', async (t) => {
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAll<string | number>([
    () => 1,
    () => 1,
    () => 3,
  ], 2)

  for await (const result of asyncIterable) {
    resultSpy(result)
  }

  t.deepEqual(
    getSpyCalls(resultSpy),
    [[1], [1], [3]],
    'should resolve in order'
  )
})

test('piAll: sync error', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([1, 1, 1], index)

    return Promise.resolve(args[0])
  })
  const resultSpy = createSpy(() => {})
  const asyncIterable = piAll([
    () => 1,
    () => promiseSpy(2),
    () => {
      throw new Error('oops')
    },
    () => 3,
    () => promiseSpy(4),
  ])

  try {
    for await (const result of asyncIterable) {
      resultSpy(result)
    }

    t.fail('should not get here')
  } catch (error) {
    t.deepEqual(
      getSpyCalls(resultSpy),
      [],
      'should resolve without the rest of the sync queue'
    )

    t.equal(
      error.message,
      'oops',
      'should throw'
    )
  }
})

test('piAll: throw with negative concurrency', (t) => {
  try {
    piAll([], -1)

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

test('piAll: throw with invalid concurrency', (t) => {
  try {
    piAll(
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

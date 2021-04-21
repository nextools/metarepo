import { toArrayAsync } from 'iterama'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { piAll } from '../src/pi-all'
import { waitFor } from './wait-for'

test('piAll: 3 with concurrency 1', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 1, 2], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], 1)

  const iterator = asyncIterable[Symbol.asyncIterator]()

  let result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1]],
    'should iterate once'
  )

  t.deepEqual(
    result.value,
    1,
    'should receive first result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2]],
    'should iterate once again'
  )

  t.equal(
    result.value,
    2,
    'should receive second result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should iterate once again'
  )

  t.equal(
    result.value,
    3,
    'should receive third result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAll: 5 with concurrency 2', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 1, 2, 3, 1], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
    () => promiseSpy(4),
    () => promiseSpy(5),
  ], 2)

  const iterator = asyncIterable[Symbol.asyncIterator]()

  let result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2]],
    'should iterate twice'
  )

  t.deepEqual(
    result.value,
    2,
    'should receive first result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should iterate once again'
  )

  t.deepEqual(
    result.value,
    1,
    'should receive second result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3], [4]],
    'should iterate once again'
  )

  t.deepEqual(
    result.value,
    3,
    'should receive third result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3], [4], [5]],
    'should iterate once again'
  )

  t.deepEqual(
    result.value,
    4,
    'should receive fourth result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3], [4], [5]],
    'should not iterate once again'
  )

  t.deepEqual(
    result.value,
    5,
    'should receive fifth result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAll: 3 with concurrency 3', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], 3)

  const iterator = asyncIterable[Symbol.asyncIterator]()

  let result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should iterate trice'
  )

  t.deepEqual(
    result.value,
    3,
    'should receive first result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should not iterate again'
  )

  t.deepEqual(
    result.value,
    2,
    'should receive second result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should not iterate again'
  )

  t.deepEqual(
    result.value,
    1,
    'should receive third result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAll: 3 with concurrency 4', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], 4)

  const iterator = asyncIterable[Symbol.asyncIterator]()

  let result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should iterate trice'
  )

  t.deepEqual(
    result.value,
    3,
    'should receive first result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should not iterate again'
  )

  t.deepEqual(
    result.value,
    2,
    'should receive second result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should not iterate again'
  )

  t.deepEqual(
    result.value,
    1,
    'should receive third result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAll: 3 with infinite concurrency', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ], Infinity)

  const iterator = asyncIterable[Symbol.asyncIterator]()

  let result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should iterate trice'
  )

  t.deepEqual(
    result.value,
    3,
    'should receive first result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should not iterate again'
  )

  t.deepEqual(
    result.value,
    2,
    'should receive second result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should not iterate again'
  )

  t.deepEqual(
    result.value,
    1,
    'should receive third result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAll: 3 with default concurrency', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
  ])

  const iterator = asyncIterable[Symbol.asyncIterator]()

  let result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should iterate trice'
  )

  t.deepEqual(
    result.value,
    3,
    'should receive first result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should not iterate again'
  )

  t.deepEqual(
    result.value,
    2,
    'should receive second result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should not iterate again'
  )

  t.deepEqual(
    result.value,
    1,
    'should receive third result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAll: iterable', async (t) => {
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

  const result = await toArrayAsync(asyncIterable)

  t.deepEqual(
    result,
    [2, 1, 3],
    'should resolve in order'
  )
})

test('piAll: sync reject', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([1, 1, 2], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => Promise.reject('oops'),
    () => Promise.resolve(4),
    () => promiseSpy(5),
  ], 2)

  try {
    const iterator = asyncIterable[Symbol.asyncIterator]()

    let result = await iterator.next()

    t.deepEqual(
      getSpyCalls(promiseSpy),
      [[1], [2]],
      'should iterate twice'
    )

    t.deepEqual(
      result.value,
      1,
      'should receive first result'
    )

    result = await iterator.next()

    t.deepEqual(
      getSpyCalls(promiseSpy),
      [[1], [2]],
      'should not iterate again'
    )

    t.deepEqual(
      result.value,
      2,
      'should receive second result'
    )

    await iterator.next()

    t.fail('should not get here')
  } catch (error) {
    t.equal(
      error,
      'oops',
      'should throw error'
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
  const asyncIterable = piAll([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
    () => promiseSpy(4),
  ], 2)

  try {
    const iterator = asyncIterable[Symbol.asyncIterator]()

    let result = await iterator.next()

    t.deepEqual(
      getSpyCalls(promiseSpy),
      [[1], [2]],
      'should iterate twice'
    )

    t.deepEqual(
      result.value,
      1,
      'should receive first result'
    )

    result = await iterator.next()

    t.deepEqual(
      getSpyCalls(promiseSpy),
      [[1], [2], [3]],
      'should iterate once again'
    )

    t.deepEqual(
      result.value,
      2,
      'should receive second result'
    )

    await iterator.next()

    t.fail('should not get here')
  } catch (error) {
    t.equal(
      error,
      'oops',
      'should throw'
    )
  }
})

test('piAll: sync', async (t) => {
  const asyncIterable = piAll<string | number>([
    () => 1,
    () => 2,
    () => 3,
  ], 2)

  const result = await toArrayAsync(asyncIterable)

  t.deepEqual(
    result,
    [1, 2, 3],
    'should resolve in order'
  )
})

test('piAll: sync error', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([1, 1, 1], index)

    return Promise.resolve(args[0])
  })
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
    const iterator = asyncIterable[Symbol.asyncIterator]()

    await iterator.next()

    t.fail('should not get here')
  } catch (error) {
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

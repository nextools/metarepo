import { toArrayAsync } from 'iterama'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { piAllSettled } from '../src/pi-all-settled'
import { waitFor } from './wait-for'

test('piAllSettled: 3 with concurrency 1', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 1, 2], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAllSettled([
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
    { status: 'fulfilled', value: 1 },
    'should receive first result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2]],
    'should iterate once again'
  )

  t.deepEqual(
    result.value,
    { status: 'fulfilled', value: 2 },
    'should receive second result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3]],
    'should iterate once again'
  )

  t.deepEqual(
    result.value,
    { status: 'fulfilled', value: 3 },
    'should receive third result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAllSettled: 5 with concurrency 2', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 1, 2, 3, 1], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAllSettled([
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
    { status: 'fulfilled', value: 2 },
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
    { status: 'fulfilled', value: 1 },
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
    { status: 'fulfilled', value: 3 },
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
    { status: 'fulfilled', value: 4 },
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
    { status: 'fulfilled', value: 5 },
    'should receive fifth result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAllSettled: 3 with concurrency 3', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAllSettled([
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
    { status: 'fulfilled', value: 3 },
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
    { status: 'fulfilled', value: 2 },
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
    { status: 'fulfilled', value: 1 },
    'should receive third result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAllSettled: 3 with concurrency 4', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAllSettled([
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
    { status: 'fulfilled', value: 3 },
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
    { status: 'fulfilled', value: 2 },
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
    { status: 'fulfilled', value: 1 },
    'should receive third result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAllSettled: 3 with infinite concurrency', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAllSettled([
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
    { status: 'fulfilled', value: 3 },
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
    { status: 'fulfilled', value: 2 },
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
    { status: 'fulfilled', value: 1 },
    'should receive third result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAllSettled: 3 with default concurrency', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([3, 2, 1], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAllSettled([
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
    { status: 'fulfilled', value: 3 },
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
    { status: 'fulfilled', value: 2 },
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
    { status: 'fulfilled', value: 1 },
    'should receive third result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAllSettled: iterable', async (t) => {
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

  const result = await toArrayAsync(asyncIterable)

  t.deepEqual(
    result,
    [
      { status: 'fulfilled', value: 2 },
      { status: 'fulfilled', value: 1 },
      { status: 'fulfilled', value: 3 },
    ],
    'should resolve in order'
  )
})

test('piAllSettled: sync reject', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([1, 1, 2], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAllSettled([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => Promise.reject('oops'),
    () => Promise.resolve(4),
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
    { status: 'fulfilled', value: 1 },
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
    { status: 'fulfilled', value: 2 },
    'should receive second result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2]],
    'should not iterate again'
  )

  t.deepEqual(
    result.value,
    { status: 'rejected', reason: 'oops' },
    'should receive rejected result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [5]],
    'should iterate once again'
  )

  t.deepEqual(
    result.value,
    { status: 'fulfilled', value: 4 },
    'should receive third result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [5]],
    'should not iterate again'
  )

  t.deepEqual(
    result.value,
    { status: 'fulfilled', value: 5 },
    'should receive fourth result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAllSettled: async reject', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([1, 2, 2, 2], index)

    if (index === 2) {
      return Promise.reject('oops')
    }

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAllSettled([
    () => promiseSpy(1),
    () => promiseSpy(2),
    () => promiseSpy(3),
    () => promiseSpy(4),
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
    { status: 'fulfilled', value: 1 },
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
    { status: 'fulfilled', value: 2 },
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
    { status: 'rejected', reason: 'oops' },
    'should receive rejected result'
  )

  result = await iterator.next()

  t.deepEqual(
    getSpyCalls(promiseSpy),
    [[1], [2], [3], [4]],
    'should not iterate again'
  )

  t.deepEqual(
    result.value,
    { status: 'fulfilled', value: 4 },
    'should receive third result'
  )

  result = await iterator.next()

  t.true(
    result.done,
    'should be done'
  )
})

test('piAllSettled: sync', async (t) => {
  const asyncIterable = piAllSettled<number>([
    () => 1,
    () => 2,
    () => 3,
  ], 2)

  const result = await toArrayAsync(asyncIterable)

  t.deepEqual(
    result,
    [
      { status: 'fulfilled', value: 1 },
      { status: 'fulfilled', value: 2 },
      { status: 'fulfilled', value: 3 },
    ],
    'should resolve in order'
  )
})

test('piAllSettled: sync error', async (t) => {
  const promiseSpy = createSpy(async ({ args, index }) => {
    await waitFor([1, 1, 1], index)

    return Promise.resolve(args[0])
  })
  const asyncIterable = piAllSettled([
    () => 1,
    () => promiseSpy(2),
    () => {
      throw new Error('oops')
    },
    () => 3,
    () => promiseSpy(4),
  ])

  const iterator = asyncIterable[Symbol.asyncIterator]()

  const result = await iterator.next()

  t.equal(
    result.value.status,
    'rejected',
    'should receive rejected result'
  )

  t.equal(
    result.value.reason.message,
    'oops',
    'should be rejected with error'
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

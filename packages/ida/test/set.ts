import { filter, map } from 'iterama'
import test from 'tape'
import { Set } from '../src/set'

test('ida: Set + toStringTag', (t) => {
  const testSet = new Set()

  t.deepEqual(
    Object.prototype.toString.call(testSet),
    '[object IdaSet]',
    'should provide custom stringTag'
  )

  t.end()
})

test('ida: Set + implement iterable', (t) => {
  const testSet = new Set([1, 2])
  const iterator = testSet[Symbol.iterator]()

  t.deepEqual(
    [iterator.next().value, iterator.next().value, iterator.next().value],
    [1, 2, undefined],
    'should implement Iterable'
  )

  t.end()
})

test('ida: Set + toArray', (t) => {
  const testSet = new Set([1, 2, 3])

  t.deepEqual(
    testSet.toArray(),
    [1, 2, 3],
    'should convert into Array'
  )

  t.end()
})

test('ida: Set + toNativeSet', (t) => {
  const testSet = new Set([1, 2, 3])

  t.deepEqual(
    testSet.toNativeSet(),
    new global.Set([1, 2, 3]),
    'should convert into native Set'
  )

  t.end()
})

test('ida: Set + constructor + iterable', (t) => {
  const iterable = {
    *[Symbol.iterator]() {
      yield 1
      yield 2
    },
  }
  const testSet = new Set(iterable)

  t.deepEqual(
    testSet.toArray(),
    [1, 2],
    'should make Set from iterable'
  )

  t.end()
})

test('ida: Set + from + iterable', (t) => {
  const iterable = {
    *[Symbol.iterator]() {
      yield 1
      yield 2
    },
  }
  const testSet = Set.from(iterable)

  t.deepEqual(
    testSet.toArray(),
    [1, 2],
    'should make Set from iterable'
  )

  t.end()
})

test('ida: Set + fromAsync + iterable', async (t) => {
  const asyncIterable = {
    async *[Symbol.asyncIterator]() {
      yield await Promise.resolve(1)
      yield await Promise.resolve(2)
    },
  }
  const testSet = await Set.fromAsync(asyncIterable)

  t.deepEqual(
    testSet.toArray(),
    [1, 2],
    'should make Set from async iterable'
  )
})

test('ida: Set + size', (t) => {
  const testSet = new Set([1, 2])

  t.equal(
    testSet.size,
    2,
    'should return size'
  )

  t.end()
})

test('ida: Set + clear', (t) => {
  const testSet = new Set([1, 2])

  testSet.clear()

  t.equal(
    testSet.size,
    0,
    'should mutate and clear values'
  )

  t.end()
})

test('ida: Set + delete', (t) => {
  const testSet = new Set([1, 2, 3])

  testSet.delete(1).delete(3)

  t.deepEqual(
    testSet.toArray(),
    [2],
    'should mutate and delete values'
  )

  t.end()
})

test('ida: Set + has', (t) => {
  const testSet = new Set([1, 2])

  t.true(
    testSet.has(1),
    'should return true for existing key'
  )

  t.false(
    testSet.has(3),
    'should return false for non-existing key'
  )

  t.end()
})

test('ida: Set + add', (t) => {
  const testSet = new Set()

  testSet.add(1).add(1).add(2)

  t.deepEqual(
    testSet.toArray(),
    [1, 2],
    'should mutate and add value'
  )

  t.end()
})

test('ida: Set + pipe', (t) => {
  const testSet = new Set([1, 2, 3, 4, 5])
  const filterFn = ((value: number) => value >= 3)
  const mapFn = ((value: number, i: number) => value + i)

  t.deepEqual(
    testSet
      .pipe(
        filter(filterFn),
        map(mapFn)
      )
      .toArray(),
    [3, 5, 7],
    'should pipe'
  )

  t.deepEqual(
    testSet.toArray(),
    [1, 2, 3, 4, 5],
    'should not mutate'
  )

  t.end()
})

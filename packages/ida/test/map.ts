import { map, filter } from 'iterama'
import test from 'tape'
import { Map } from '../src/map'

test('ida: Map + toStringTag', (t) => {
  const testMap = new Map()

  t.deepEqual(
    Object.prototype.toString.call(testMap),
    '[object IdaMap]',
    'should provide custom stringTag'
  )

  t.end()
})

test('ida: Map + implement iterable', (t) => {
  const testMap = new Map([['a', 1], ['b', 2]])
  const iterator = testMap[Symbol.iterator]()

  t.deepEqual(
    [iterator.next().value, iterator.next().value, iterator.next().value],
    [['a', 1], ['b', 2], undefined],
    'should implement Iterable'
  )

  t.end()
})

test('ida: Map + toObject', (t) => {
  const testMap = new Map([
    [() => 1, 1],
    [() => 1, 1],
    [() => 2, 2],
  ])

  t.deepEqual(
    testMap.toObject(),
    {
      '() => 1': 1,
      '() => 2': 2,
    },
    'should convert into Object'
  )

  t.end()
})

test('ida: Map + toNativeMap', (t) => {
  const testMap = new Map([
    ['a', 1],
    ['b', 2],
  ])

  t.deepEqual(
    testMap.toNativeMap(),
    new global.Map([
      ['a', 1],
      ['b', 2],
    ]),
    'should convert into native Map'
  )

  t.end()
})

test('ida: Map + constructor + iterable', (t) => {
  const iterable = {
    *[Symbol.iterator]() {
      yield ['a', 1] as const
      yield ['b', 2] as const
    },
  }
  const testMap = new Map(iterable)

  t.deepEqual(
    testMap.toObject(),
    { a: 1, b: 2 },
    'should make Map from iterable'
  )

  t.end()
})

test('ida: Map + from + iterable', (t) => {
  const iterable = {
    *[Symbol.iterator]() {
      yield ['a', 1] as const
      yield ['b', 2] as const
    },
  }
  const testMap = Map.from(iterable)

  t.deepEqual(
    testMap.toObject(),
    { a: 1, b: 2 },
    'should make Map from iterable'
  )

  t.end()
})

test('ida: Map + fromAsync + async iterable', async (t) => {
  const asyncIterable = {
    async *[Symbol.asyncIterator]() {
      yield await Promise.resolve(['a', 1] as const)
      yield await Promise.resolve(['b', 2] as const)
    },
  }
  const testMap = await Map.fromAsync(asyncIterable)

  t.deepEqual(
    testMap.toObject(),
    { a: 1, b: 2 },
    'should make Map from async iterable'
  )
})

test('ida: Map + size', (t) => {
  const testMap = new Map([
    ['a', 1],
    ['b', 2],
  ])

  t.equal(
    testMap.size,
    2,
    'should return size'
  )

  t.end()
})

test('ida: Map + clear', (t) => {
  const testMap = new Map([
    ['a', 1],
    ['b', 2],
  ])

  testMap.clear()

  t.equal(
    testMap.size,
    0,
    'should mutate and clear entries'
  )

  t.end()
})

test('ida: Map + delete', (t) => {
  const testMap = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ])

  testMap.delete('a').delete('c')

  t.deepEqual(
    testMap.toObject(),
    { b: 2 },
    'should mutate and delete entries'
  )

  t.end()
})

test('ida: Map + has', (t) => {
  const testMap = new Map([
    ['a', 1],
    ['b', 2],
  ])

  t.true(
    testMap.has('a'),
    'should return true for existing key'
  )

  t.false(
    testMap.has('c'),
    'should return false for non-existing key'
  )

  t.end()
})

test('ida: Map + get', (t) => {
  const testMap = new Map([
    ['a', 1],
    ['b', 2],
  ])

  t.equal(
    testMap.get('a'),
    1,
    'should return value of existing key'
  )

  t.equal(
    testMap.get('c', 3),
    3,
    'should return fallback value for non-existing key'
  )

  t.equal(
    testMap.get('c'),
    undefined,
    'should return undefined for non-existing key'
  )

  t.end()
})

test('ida: Map + set', (t) => {
  const testMap = new Map([['a', 0]])

  testMap.set('a', 1).set('b', 2)

  t.deepEqual(
    testMap.toObject(),
    { a: 1, b: 2 },
    'should mutate and set key/value entry'
  )

  t.end()
})

test('ida: Map + update', (t) => {
  const testMap = new Map([['a', 0]])

  testMap.update('a', (a) => a! + 1)

  t.deepEqual(
    testMap.toObject(),
    { a: 1 },
    'should mutate and update value of existing key'
  )

  testMap.update('b', (b) => b + 2, 0)

  t.deepEqual(
    testMap.toObject(),
    { a: 1, b: 2 },
    'should mutate and update fallback value of non-existing key'
  )

  testMap.update('c', (c) => c ?? 3)

  t.deepEqual(
    testMap.toObject(),
    { a: 1, b: 2, c: 3 },
    'should mutate and update undefined value of non-existing key'
  )

  t.end()
})

test('ida: Map + keys', (t) => {
  const testMap = new Map([
    ['a', 1],
    ['b', 2],
  ])

  t.deepEqual(
    Array.from(testMap.keys()),
    ['a', 'b'],
    'should return keys Set'
  )

  t.end()
})

test('ida: Map + values', (t) => {
  const testMap = new Map([
    ['a', 1],
    ['b', 2],
  ])

  t.deepEqual(
    Array.from(testMap.values()),
    [1, 2],
    'should return values Set'
  )

  t.end()
})

test('ida: Map + pipe', (t) => {
  const testMap = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3],
    ['d', 4],
  ])
  const filterFn = (([key]: readonly [string, number]) => key !== 'a')
  const mapFn = (([key, value]: readonly [string, number], i: number) => [`${key}${key}`, value + i] as const)

  t.deepEqual(
    testMap
      .pipe(
        filter(filterFn),
        map(mapFn)
      )
      .toObject(),
    { bb: 2, cc: 4, dd: 6 },
    'should pipe'
  )

  t.deepEqual(
    testMap.toObject(),
    { a: 1, b: 2, c: 3, d: 4 },
    'should not mutate'
  )

  t.end()
})

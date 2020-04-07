import test from 'tape'
import Circularr from '../src/index'

test('constructor', (t) => {
  const arr = new Circularr(3)

  t.deepEquals(Array.from(arr), [undefined, undefined, undefined])

  t.end()
})

test('from', (t) => {
  const arr = Circularr.from([1, 2, 3])

  t.deepEquals(Array.from(arr), [1, 2, 3])

  t.end()
})

test('length', (t) => {
  const arr = Circularr.from([1, 2, 3])

  t.equals(arr.length, 3)

  t.end()
})

test('fill', (t) => {
  const arr = new Circularr<number>(3)

  arr.fill(42)

  t.deepEquals(Array.from(arr), [42, 42, 42])

  t.end()
})

test('clear', (t) => {
  const arr = new Circularr<number>(3)

  arr.fill(42)
  arr.clear()

  t.deepEquals(Array.from(arr), [undefined, undefined, undefined])

  t.end()
})

test('shift', (t) => {
  const arr = new Circularr(3).fill(0)
  const res0 = arr.shift(42)

  t.deepEquals(Array.from(arr), [0, 0, 42])
  t.equals(res0, 0)

  const res1 = arr.shift(16)

  t.deepEquals(Array.from(arr), [0, 42, 16])
  t.equals(res1, 0)

  const res2 = arr.shift(32)

  t.deepEquals(Array.from(arr), [42, 16, 32])
  t.equals(res2, 0)

  const res3 = arr.shift(64)

  t.deepEquals(Array.from(arr), [16, 32, 64])
  t.equals(res3, 42)

  t.end()
})

test('unshift', (t) => {
  const arr = new Circularr(3).fill(0)
  const res0 = arr.unshift(42)

  t.deepEquals(Array.from(arr), [42, 0, 0])
  t.equals(res0, 0)

  const res1 = arr.unshift(16)

  t.deepEquals(Array.from(arr), [16, 42, 0])
  t.equals(res1, 0)

  const res2 = arr.unshift(32)

  t.deepEquals(Array.from(arr), [32, 16, 42])
  t.equals(res2, 0)

  const res3 = arr.unshift(64)

  t.deepEquals(Array.from(arr), [64, 32, 16])
  t.equals(res3, 42)

  t.end()
})

test('slice: should work with no values', (t) => {
  const arr = Circularr.from([0, 0, 1, 2, 3])

  arr.shift(4)
  arr.shift(5)

  const res = arr.slice()

  t.deepEquals(Array.from(res), [1, 2, 3, 4, 5])

  t.end()
})

test('slice: should work with positive value', (t) => {
  const arr = Circularr.from([0, 0, 1, 2, 3])

  arr.shift(4)
  arr.shift(5)

  const res = arr.slice(2)

  t.deepEquals(Array.from(res), [3, 4, 5])

  t.end()
})

test('slice: should work with positive value overflow', (t) => {
  const arr = Circularr.from([0, 0, 1, 2, 3])

  arr.shift(4)
  arr.shift(5)

  const res = arr.slice(10)

  t.deepEquals(Array.from(res), [])

  t.end()
})

test('slice: should work with negative values', (t) => {
  const arr = Circularr.from([0, 0, 1, 2, 3])

  arr.shift(4)
  arr.shift(5)

  const res = arr.slice(-2)

  t.deepEquals(Array.from(res), [4, 5])

  t.end()
})

test('slice: should work with negative value overflow', (t) => {
  const arr = Circularr.from([0, 0, 1, 2, 3])

  arr.shift(4)
  arr.shift(5)

  const res = arr.slice(-10)

  t.deepEquals(Array.from(res), [1, 2, 3, 4, 5])

  t.end()
})

test('slice: should work with range', (t) => {
  const arr = Circularr.from([0, 0, 1, 2, 3])

  arr.shift(4)
  arr.shift(5)

  const res = arr.slice(1, 4)

  t.deepEquals(Array.from(res), [2, 3, 4])

  t.end()
})

test('slice: should work with range overflow', (t) => {
  const arr = Circularr.from([0, 0, 1, 2, 3])

  arr.shift(4)
  arr.shift(5)

  const res = arr.slice(1, 10)

  t.deepEquals(Array.from(res), [2, 3, 4, 5])

  t.end()
})

test('slice: should work with range order mismatch', (t) => {
  const arr = Circularr.from([0, 0, 1, 2, 3])

  arr.shift(4)
  arr.shift(5)

  const res = arr.slice(4, 1)

  t.deepEquals(Array.from(res), [])

  t.end()
})

test('slice: should work with range end negative', (t) => {
  const arr = Circularr.from([0, 0, 1, 2, 3])

  arr.shift(4)
  arr.shift(5)

  const res = arr.slice(1, -2)

  t.deepEquals(Array.from(res), [2, 3])

  t.end()
})

test('slice: should work with range end negative overflow', (t) => {
  const arr = Circularr.from([0, 0, 1, 2, 3])

  arr.shift(4)
  arr.shift(5)

  const res = arr.slice(1, -10)

  t.deepEquals(Array.from(res), [])

  t.end()
})

test('slice: should work with range begin negative', (t) => {
  const arr = Circularr.from([0, 0, 1, 2, 3])

  arr.shift(4)
  arr.shift(5)

  const res = arr.slice(-3, 4)

  t.deepEquals(Array.from(res), [3, 4])

  t.end()
})

test('slice: should work with range negative', (t) => {
  const arr = Circularr.from([0, 0, 1, 2, 3])

  arr.shift(4)
  arr.shift(5)

  const res = arr.slice(-3, -1)

  t.deepEquals(Array.from(res), [3, 4])

  t.end()
})

test('slice: should work with range negative mismatch', (t) => {
  const arr = Circularr.from([0, 0, 1, 2, 3])

  arr.shift(4)
  arr.shift(5)

  const res = arr.slice(-1, -3)

  t.deepEquals(Array.from(res), [])

  t.end()
})

test('trim: should work with shift', (t) => {
  const arr = new Circularr<number>(5)

  arr.shift(4)
  arr.shift(5)

  const res = arr.trim()

  t.deepEquals(Array.from(res), [4, 5])

  t.end()
})

test('trim: should work with unshift', (t) => {
  const arr = new Circularr<number>(5)

  arr.unshift(4)
  arr.unshift(5)

  const res = arr.trim()

  t.deepEquals(Array.from(res), [5, 4])

  t.end()
})

test('trim: should work with both shift and unshift', (t) => {
  const arr = new Circularr<number>(5)

  arr.shift(3)
  arr.shift(4)
  arr.unshift(5)

  const res = arr.trim()

  t.deepEquals(Array.from(res), [5, undefined, undefined, undefined, 3])

  t.end()
})

test('trim: should work with from array', (t) => {
  const arr = Circularr.from([1, 2, 3])
  const res = arr.trim()

  t.deepEquals(Array.from(res), [1, 2, 3])

  t.end()
})

test('trim: should work with filled array', (t) => {
  const arr = new Circularr<number>(3).fill(0)
  const res = arr.trim()

  t.deepEquals(Array.from(res), [0, 0, 0])

  t.end()
})

test('at', (t) => {
  const arr = new Circularr<number>(4)

  arr.shift(3)
  arr.shift(4)

  t.equals(arr.at(0), undefined)
  t.equals(arr.at(1), undefined)
  t.equals(arr.at(2), 3)
  t.equals(arr.at(3), 4)

  t.end()
})

test('at: should work with negative index', (t) => {
  const arr = new Circularr<number>(4)

  arr.shift(3)
  arr.shift(4)

  t.equals(arr.at(-2), undefined)

  t.end()
})

test('at: should work with overflow index', (t) => {
  const arr = new Circularr<number>(4)

  arr.shift(3)
  arr.shift(4)

  t.equals(arr.at(10), undefined)

  t.end()
})

test('wrapAt', (t) => {
  const arr = new Circularr<number>(4)

  arr.shift(3)
  arr.shift(4)

  t.equals(arr.wrapAt(0), undefined)
  t.equals(arr.wrapAt(1), undefined)
  t.equals(arr.wrapAt(2), 3)
  t.equals(arr.wrapAt(3), 4)

  t.end()
})

test('wrapAt: should work with negative index', (t) => {
  const arr = new Circularr<number>(4)

  arr.shift(3)
  arr.shift(4)

  t.equals(arr.wrapAt(-1), 4)
  t.equals(arr.wrapAt(-2), 3)
  t.equals(arr.wrapAt(-3), undefined)
  t.equals(arr.wrapAt(-4), undefined)

  t.end()
})

test('wrapAt: should work with overflow index', (t) => {
  const arr = new Circularr<number>(4)

  arr.shift(3)
  arr.shift(4)

  t.equals(arr.wrapAt(10), 3)
  t.equals(arr.wrapAt(11), 4)
  t.equals(arr.wrapAt(12), undefined)
  t.equals(arr.wrapAt(13), undefined)
  t.equals(arr.wrapAt(14), 3)

  t.end()
})

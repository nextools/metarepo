import test from 'tape'
import { pipe } from '@psxcode/compose'
import { slice } from '../src/slice'
import { toArray } from '../src/to-array'
import { range } from '../src/range'

test('iterama: slice + no args', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should not skip and take all'
  )

  t.end()
})

test('iterama: slice + from', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(1),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [1, 2, 3, 4],
    'should skip and take the rest'
  )

  t.end()
})

test('iterama: slice + from + to', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(1, 3),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [1, 2, 3],
    'should skip and take'
  )

  t.end()
})

test('iterama: slice + from + negative to', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(1, -1),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [1, 2, 3],
    'should skip and take last'
  )

  t.end()
})

test('iterama: slice + negative from + to', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(-3, 2),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [2, 3],
    'should skip from end and take'
  )

  t.end()
})

test('iterama: slice + negative from + negative to', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(-3, -1),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [2, 3],
    'should skip from end and take last'
  )

  t.end()
})

test('iterama: slice + more than needed from + to', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(42, 2),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip all and take nothing'
  )

  t.end()
})

test('iterama: slice + more than needed negative from + to', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(-42, 2),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [0, 1],
    'should skip all from end and take'
  )

  t.end()
})

test('iterama: slice + from + more than needed to', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(2, 42),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [2, 3, 4],
    'should skip and take the rest'
  )

  t.end()
})

test('iterama: slice + from + more than needed negative to', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(2, -42),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip and take nothing including skipped'
  )

  t.end()
})

test('iterama: slice + more than needed from + more than needed to', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(42, 42),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip all and take nothing'
  )

  t.end()
})

test('iterama: slice + more than needed negative from + more than needed to', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(-42, 42),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [0, 1, 2, 3, 4],
    'should skip all from end and take the rest'
  )

  t.end()
})

test('iterama: slice + more than needed from + more than needed negative to', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(42, -42),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip all and take all last'
  )

  t.end()
})

test('iterama: slice + more than needed negative from + more than needed negative to', (t) => {
  const iterable = range(5)
  const result = pipe(
    slice(-42, -42),
    toArray
  )(iterable)

  t.deepEquals(
    result,
    [],
    'should skip all from end and take all last'
  )

  t.end()
})

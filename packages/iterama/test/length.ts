import test from 'tape'
import { length } from '../src/length'
import { range } from '../src/range'

test('iterama: length', (t) => {
  const iterable = range(5)
  const result = length(iterable)

  t.equals(
    result,
    5,
    'should return length of iterable'
  )

  t.end()
})

test('iterama: length max integer', (t) => {
  const iterable = range(5)
  const oldNum = Number

  // eslint-disable-next-line no-global-assign
  Number = {
    MAX_SAFE_INTEGER: 3,
  } as any

  const result = length(iterable)

  // eslint-disable-next-line no-global-assign
  Number = oldNum

  t.equals(
    result,
    3,
    'should return length of iterable'
  )

  t.end()
})

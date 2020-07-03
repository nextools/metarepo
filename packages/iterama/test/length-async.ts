import test from 'tape'
import { lengthAsync } from '../src/length-async'
import { rangeAsync } from '../src/range-async'

test('iterama: lengthAsync', async (t) => {
  const iterable = rangeAsync(5)
  const result = await lengthAsync(iterable)

  t.equals(
    result,
    5,
    'should return length of iterable'
  )
})

test('iterama: length max integer', async (t) => {
  const iterable = rangeAsync(5)
  const oldNum = Number

  // eslint-disable-next-line no-global-assign
  Number = {
    isSafeInteger: Number.isSafeInteger, // required by Node v10
    MAX_SAFE_INTEGER: 3,
  } as any

  const result = await lengthAsync(iterable)

  // eslint-disable-next-line no-global-assign
  Number = oldNum

  t.equals(
    result,
    3,
    'should return length of iterable'
  )
})

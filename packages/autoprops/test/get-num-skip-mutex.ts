import test from 'blue-tape'
import I from 'big-integer'
import { getNumSkipMutex } from '../src/get-num-skip-mutex'

test('getNumSkipMutex', (t) => {
  t.true(
    getNumSkipMutex(
      [I(1), I(1), I(0)],
      [I(4), I(2), I(4)],
      0
    ).equals(I(3)),
    'should return num mutexes to skip'
  )

  t.true(
    getNumSkipMutex(
      [I(0), I(1), I(0), I(1)],
      [I(4), I(4), I(4), I(4)],
      1
    ).equals(I(12)),
    'should return num mutexes to skip'
  )

  t.true(
    getNumSkipMutex(
      [I(0), I(1), I(1), I(0)],
      [I(4), I(4), I(4), I(4)],
      1
    ).equals(I(12)),
    'should return num mutexes to skip'
  )

  t.true(
    getNumSkipMutex(
      [I(1), I(0), I(1), I(0), I(1)],
      [I(4), I(4), I(4), I(4), I(4)],
      0
    ).equals(I(3)),
    'should return num mutexes to skip'
  )

  t.end()
})

import test from 'blue-tape'
import BigInt from 'big-integer'
import { getNumSkipMutex } from '../src/get-num-skip-mutex'

test('getNumSkipMutex', (t) => {
  t.true(
    getNumSkipMutex([BigInt(1), BigInt(1), BigInt(0)], [BigInt(4), BigInt(2), BigInt(4)], 0).equals(BigInt(3)),
    'should return num mutexes to skip'
  )

  t.true(
    getNumSkipMutex([BigInt(0), BigInt(1), BigInt(0), BigInt(1)], [BigInt(4), BigInt(4), BigInt(4), BigInt(4)], 1).equals(BigInt(12)),
    'should return num mutexes to skip'
  )

  t.true(
    getNumSkipMutex([BigInt(0), BigInt(1), BigInt(1), BigInt(0)], [BigInt(4), BigInt(4), BigInt(4), BigInt(4)], 1).equals(BigInt(12)),
    'should return num mutexes to skip'
  )

  t.true(
    getNumSkipMutex([BigInt(1), BigInt(0), BigInt(1), BigInt(0), BigInt(1)], [BigInt(4), BigInt(4), BigInt(4), BigInt(4), BigInt(4)], 0).equals(BigInt(3)),
    'should return num mutexes to skip'
  )

  t.end()
})

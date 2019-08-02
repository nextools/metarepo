import test from 'blue-tape'
import { getNumSkipMutex } from '../src/get-num-skip-mutex'

test('getNumSkipMutex', (t) => {
  t.equals(
    getNumSkipMutex([1n, 1n, 0n], [4n, 2n, 4n], 0),
    3n,
    'should return num mutexes to skip'
  )

  t.equals(
    getNumSkipMutex([0n, 1n, 0n, 1n], [4n, 4n, 4n, 4n], 1),
    12n,
    'should return num mutexes to skip'
  )

  t.equals(
    getNumSkipMutex([0n, 1n, 1n, 0n], [4n, 4n, 4n, 4n], 1),
    12n,
    'should return num mutexes to skip'
  )

  t.equals(
    getNumSkipMutex([1n, 0n, 1n, 0n, 1n], [4n, 4n, 4n, 4n, 4n], 0),
    3n,
    'should return num mutexes to skip'
  )

  t.end()
})

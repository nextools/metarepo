import test from 'blue-tape'
import { getNumMutexesToSkip } from '../src/get-num-mutexes-to-skip'

test('getNumMutexesToSkip', (t) => {
  const lengthPerm = [4, 2, 4]
  const currentPerm = [1, 1, 0]

  t.equals(
    getNumMutexesToSkip(currentPerm, lengthPerm),
    3,
    'should return num mutexes to skip'
  )

  t.end()
})

test('getNumMutexesToSkip', (t) => {
  const lengthPerm = [4, 2, 4]
  const currentPerm = [0, 1, 1]

  t.equals(
    getNumMutexesToSkip(currentPerm, lengthPerm),
    4,
    'should return num mutexes to skip'
  )

  t.end()
})

test('getNumMutexesToSkip', (t) => {
  const lengthPerm = [4, 20, 4, 2]
  const currentPerm = [0, 1, 0, 1]

  t.equals(
    getNumMutexesToSkip(currentPerm, lengthPerm),
    76,
    'should return num mutexes to skip'
  )

  t.end()
})

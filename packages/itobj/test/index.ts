import test from 'tape'
import { iterateObjectEntries, iterateObjectKeys, iterateObjectValues } from '../src'

const symbol = Symbol('SYMBOL')
const number = 2
const obj = {
  a: 1,
  [number]: 'b',
  [symbol]: true,
}

test('itobj: iterateObjectKeys', (t) => {
  const result = Array.from(iterateObjectKeys(obj))

  t.deepEqual(
    result,
    ['2', 'a'],
    'should work'
  )

  t.end()
})

test('itobj: iterateObjectValues', (t) => {
  const result = Array.from(iterateObjectValues(obj))

  t.deepEqual(
    result,
    ['b', 1],
    'should work'
  )

  t.end()
})

test('itobj: iterateObjectEntries', (t) => {
  const result = Array.from(iterateObjectEntries(obj))

  t.deepEqual(
    result,
    [
      ['2', 'b'],
      ['a', 1],
    ],
    'should work'
  )

  t.end()
})

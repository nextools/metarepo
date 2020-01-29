import test from 'blue-tape'
import { shallowEqualByKeys } from '../src'

test('shallowEqualByKeys', (t) => {
  t.equals(
    shallowEqualByKeys({}, {}, []),
    true,
    'empty objects, empty watch-keys'
  )

  t.equals(
    shallowEqualByKeys({}, {}, ['a', 'b'] as any),
    true,
    'empty objects, non empty watch-keys'
  )

  t.equals(
    shallowEqualByKeys({ a: 1 }, { a: 1 }, ['a', 'b'] as any),
    true,
    'redundant watch-keys'
  )

  t.equals(
    shallowEqualByKeys({ a: 1, b: true }, { a: 1, b: false }, ['a']),
    true,
    'equal by watch-keys'
  )

  t.equals(
    shallowEqualByKeys({ a: 1, b: true }, { a: 1, b: false }, ['a', 'b']),
    false,
    'not equal by watch-keys'
  )

  const obj = { a: 1, b: true }

  t.equals(
    shallowEqualByKeys(obj, obj, ['a']),
    true,
    'same object instance'
  )

  t.end()
})

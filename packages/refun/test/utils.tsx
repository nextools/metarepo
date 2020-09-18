import test from 'tape'
import { shallowEquals, shallowEqualByKeys } from '../src'

test('shallowEquals', (t) => {
  const obj = {}

  t.true(
    shallowEquals(obj, obj),
    'same objects'
  )

  t.true(
    shallowEquals({}, {}),
    'empty objects'
  )

  t.true(
    shallowEquals({ a: 1, b: true }, { a: 1, b: true }),
    'equal objects'
  )

  t.false(
    shallowEquals({ a: 1, b: true }, { a: 1, b: false }),
    'unequal objects'
  )

  t.false(
    shallowEquals({ a: 1, b: true, c: 'string' }, { a: 1, b: true }),
    'equal base, extra prop'
  )

  t.false(
    shallowEquals({ a: 1, b: true }, { a: 1, b: true, c: 'string' }),
    'equal base, extra prop'
  )

  t.end()
})

test('shallowEqualByKeys', (t) => {
  t.true(
    shallowEqualByKeys({}, {}, []),
    'empty objects, empty watch-keys'
  )

  t.true(
    shallowEqualByKeys({}, {}, ['a', 'b'] as any),
    'empty objects, non empty watch-keys'
  )

  t.true(
    shallowEqualByKeys({ a: 1 }, { a: 1 }, ['a', 'b'] as any),
    'redundant watch-keys'
  )

  t.true(
    shallowEqualByKeys({ a: 1, b: true }, { a: 1, b: false }, ['a']),
    'equal by watch-keys'
  )

  t.false(
    shallowEqualByKeys({ a: 1, b: true }, { a: 1, b: false }, ['a', 'b']),
    'not equal by watch-keys'
  )

  const obj = { a: 1, b: true }

  t.true(
    shallowEqualByKeys(obj, obj, ['a']),
    'same object instance'
  )

  t.end()
})

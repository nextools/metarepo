import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { compose } from '../src/compose'
import { add, constant, mult, throwing, toString } from './utils'

test('funcom: compose + identity function', (t) => {
  const composed = compose<number>()
  const result: number = composed(1)

  t.equal(
    result,
    1,
    'should work'
  )

  t.end()
})

test('funcom: compose + constant function', (t) => {
  const composed = compose(
    constant(10),
    add(2)
  )
  const result: number = composed(2)

  t.equal(
    result,
    10,
    'should work'
  )

  t.end()
})

test('funcom: compose + 1 function', (t) => {
  const composed = compose(add(2))
  const result: number = composed(2)

  t.equal(
    result,
    4,
    'should work'
  )

  t.end()
})

test('funcom: compose + 2 functions', (t) => {
  const composed = compose(
    mult(10),
    add(2)
  )
  const result: number = composed(0)

  t.equal(
    result,
    20,
    'should work'
  )

  t.end()
})

test('funcom: compose + 3 functions', (t) => {
  const composed = compose(
    toString,
    mult(10),
    add(2)
  )
  const result: string = composed(0)

  t.equal(
    result,
    '20',
    'should work'
  )

  t.end()
})

test('funcom: compose + error', (t) => {
  const spy = createSpy(() => {})
  const composed = compose(
    spy,
    throwing('oops'),
    spy,
    add(2)
  )

  try {
    composed(0)

    t.fail('should not get here')
  } catch (error) {
    t.equal(
      error.message,
      'oops',
      'should throw'
    )

    t.deepEqual(
      getSpyCalls(spy),
      [[2]],
      'should stop composing'
    )
  }

  t.end()
})

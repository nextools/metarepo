import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pipe } from '../src/pipe'
import { add, constant, mult, throwing, toString } from './utils'

test('funcom: pipe + identity function', (t) => {
  const piped = pipe<number>()
  const result: number = piped(1)

  t.equal(
    result,
    1,
    'should work'
  )

  t.end()
})

test('funcom: pipe + constant function', (t) => {
  const piped = pipe(
    add(2),
    constant(10)
  )
  const result: number = piped(2)

  t.equal(
    result,
    10,
    'should work'
  )

  t.end()
})

test('funcom: pipe + 1 function', (t) => {
  const piped = pipe(add(2))
  const result: number = piped(2)

  t.equal(
    result,
    4,
    'should work'
  )

  t.end()
})

test('funcom: pipe + 2 functions', (t) => {
  const piped = pipe(
    add(2),
    mult(10)
  )
  const result: number = piped(0)

  t.equal(
    result,
    20,
    'should work'
  )

  t.end()
})

test('funcom: pipe + 3 functions', (t) => {
  const piped = pipe(
    add(2),
    mult(10),
    toString
  )
  const result: string = piped(0)

  t.equal(
    result,
    '20',
    'should work'
  )

  t.end()
})

test('funcom: pipe + error', (t) => {
  const spy = createSpy(() => {})
  const piped = pipe(
    add(2),
    spy,
    throwing('oops'),
    spy
  )

  try {
    piped(0)

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
      'should stop piping'
    )
  }

  t.end()
})

import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { all } from '../src/all'
import { noop, constant, add, mult, toString, throwing } from './utils'

test('funcom: all + no args', (t) => {
  const piped = all()
  const result: [] = piped()

  t.deepEqual(
    result,
    [],
    'should return empty array'
  )

  t.end()
})

test('funcom: all + void function', (t) => {
  const piped = all(noop)
  const result: [void] = piped()

  t.deepEqual(
    result,
    [undefined],
    'should work'
  )

  t.end()
})

test('funcom: all + constant function', (t) => {
  const piped = all(constant(10))
  const result: [number] = piped()

  t.deepEqual(
    result,
    [10],
    'should work'
  )

  t.end()
})

test('funcom: all + 1 function', (t) => {
  const piped = all(add(2))
  const result: [number] = piped(2)

  t.deepEqual(
    result,
    [4],
    'should work'
  )

  t.end()
})

test('funcom: all + 2 functions', (t) => {
  const piped = all(
    add(2),
    mult(3)
  )
  const result: [number, number] = piped(2)

  t.deepEqual(
    result,
    [4, 6],
    'should work'
  )

  t.end()
})

test('funcom: all + 3 functions', (t) => {
  const piped = all(
    constant(10),
    add(2),
    toString
  )
  const result: [number, number, string] = piped(4)

  t.deepEqual(
    result,
    [10, 6, '4'],
    'should work'
  )

  t.end()
})

test('funcom: all + error', (t) => {
  const spy = createSpy(() => {})
  const piped = all(
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
      [[0]],
      'should stop piping'
    )
  }

  t.end()
})

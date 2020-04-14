import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { allAsync } from '../src/all-async'
import { noop, add, mult, constantAsync, addAsync, toStringAsync, throwingAsync } from './utils'

test('funcom: allAsync + no args', async (t) => {
  const piped = allAsync()
  const result: [] = await piped()

  t.deepEqual(
    result,
    [],
    'should return empty array'
  )
})

test('funcom: allAsync + void function', async (t) => {
  const piped = allAsync(noop)
  const result: [void] = await piped()

  t.deepEqual(
    result,
    [undefined],
    'should work'
  )
})

test('funcom: allAsync + constant function', async (t) => {
  const piped = allAsync(constantAsync(10))
  const result: [number] = await piped()

  t.deepEqual(
    result,
    [10],
    'should work'
  )
})

test('funcom: allAsync + 1 function', async (t) => {
  const piped = allAsync(addAsync(2))
  const result: [number] = await piped(2)

  t.deepEqual(
    result,
    [4],
    'should work'
  )
})

test('funcom: allAsync + 2 functions', async (t) => {
  const piped = allAsync(
    addAsync(2),
    mult(3)
  )
  const result: [number, number] = await piped(2)

  t.deepEqual(
    result,
    [4, 6],
    'should work'
  )
})

test('funcom: allAsync + 3 functions', async (t) => {
  const piped = allAsync(
    constantAsync(10),
    add(2),
    toStringAsync
  )
  const result: [number, number, string] = await piped(4)

  t.deepEqual(
    result,
    [10, 6, '4'],
    'should work'
  )
})

test('funcom: allAsync + error', async (t) => {
  const spy = createSpy(() => {})
  const piped = allAsync(
    add(2),
    spy,
    throwingAsync('oops'),
    spy
  )

  try {
    await piped(0)

    t.fail('should not get here')
  } catch (error) {
    t.equal(
      error.message,
      'oops',
      'should throw'
    )

    t.deepEqual(
      getSpyCalls(spy),
      [[0], [0]],
      'should pipe initial value to all functions'
    )
  }

  t.end()
})

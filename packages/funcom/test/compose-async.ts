import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { composeAsync } from '../src/compose-async'
import { addAsync, constantAsync, mult, toStringAsync, throwingAsync } from './utils'

test('funcom: composeAsync + identity function', async (t) => {
  const composed = composeAsync<number>()
  const result: number = await composed(1)

  t.equal(
    result,
    1,
    'should work'
  )
})

test('funcom: composeAsync + constant function', async (t) => {
  const composed = composeAsync(
    constantAsync(10),
    addAsync(2)
  )
  const result: number = await composed(2)

  t.equal(
    result,
    10,
    'should work'
  )
})

test('funcom: composeAsync + 1 function', async (t) => {
  const composed = composeAsync(addAsync(2))
  const result: number = await composed(2)

  t.equal(
    result,
    4,
    'should work'
  )
})

test('funcom: composeAsync + 2 functions', async (t) => {
  const composed = composeAsync(
    mult(10),
    addAsync(2)
  )
  const result: number = await composed(0)

  t.equal(
    result,
    20,
    'should work'
  )
})

test('funcom: composeAsync + 3 functions', async (t) => {
  const composed = composeAsync(
    toStringAsync,
    mult(10),
    addAsync(2)
  )
  const result: string = await composed(0)

  t.equal(
    result,
    '20',
    'should work'
  )
})

test('funcom: composeAsync + error', async (t) => {
  const spy = createSpy(() => {})
  const composed = composeAsync(
    spy,
    throwingAsync('oops'),
    spy,
    addAsync(2)
  )

  try {
    await composed(0)

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
})

import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { pipeAsync } from '../src/pipe-async'
import { addAsync, constantAsync, mult, toStringAsync, throwingAsync } from './utils'

test('funcom: pipeAsync + identity function', async (t) => {
  const piped = pipeAsync<number>()
  const result: number = await piped(1)

  t.equal(
    result,
    1,
    'should work'
  )
})

test('funcom: pipeAsync + constant function', async (t) => {
  const piped = pipeAsync(
    addAsync(2),
    constantAsync(10)
  )
  const result: number = await piped(2)

  t.equal(
    result,
    10,
    'should work'
  )
})

test('funcom: pipeAsync + 1 function', async (t) => {
  const piped = pipeAsync(addAsync(2))
  const result: number = await piped(2)

  t.equal(
    result,
    4,
    'should work'
  )
})

test('funcom: pipeAsync + 2 functions', async (t) => {
  const piped = pipeAsync(
    addAsync(2),
    mult(10)
  )
  const result: number = await piped(0)

  t.equal(
    result,
    20,
    'should work'
  )
})

test('funcom: pipeAsync + 3 functions', async (t) => {
  const piped = pipeAsync(
    addAsync(2),
    mult(10),
    toStringAsync
  )
  const result: string = await piped(0)

  t.equal(
    result,
    '20',
    'should work'
  )
})

test('funcom: pipeAsync + error', async (t) => {
  const spy = createSpy(() => {})
  const piped = pipeAsync(
    addAsync(2),
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
      [[2]],
      'should stop piping'
    )
  }
})

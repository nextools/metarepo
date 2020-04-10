/* eslint-disable no-param-reassign */
import test from 'tape'
import { createSpy } from 'spyfn'
import { makeSetTimeoutContext, tickTimeout, makeSetTimeout, getSetTimeoutCalls, getClearTimeoutCalls } from 'time-test'
import { waitPromiseFactory } from '../src/wait-promise'

test('waitPromise', async (t) => {
  const timeoutGetter = createSpy(((i = 0, v = [100, 200, 300]) => () => v[i++])())

  const timeContext = makeSetTimeoutContext()
  const tick = tickTimeout(timeContext)

  const waiter = waitPromiseFactory(
    makeSetTimeout(timeContext)
  )(timeoutGetter)

  // Use getter value
  const p1 = waiter()
  // Use explicit value
  const p2 = waiter(500)

  t.deepEquals(
    getSetTimeoutCalls(timeContext),
    [
      { delay: 100 },
      { delay: 500 },
    ],
    'should call setTimeout'
  )

  t.deepEquals(
    getClearTimeoutCalls(timeContext),
    [],
    'should not call clearTimeout'
  )

  tick()

  // Promise should be now resolved
  await p1

  tick()

  // Promise should be now resolved
  await p2
})

test('waitPromise; no getter', async (t) => {
  const timeContext = makeSetTimeoutContext()
  const tick = tickTimeout(timeContext)

  const waiter = waitPromiseFactory(
    makeSetTimeout(timeContext)
  )()

  // Use getter value
  const p1 = waiter()
  // Use explicit value
  const p2 = waiter(500)

  t.deepEquals(
    getSetTimeoutCalls(timeContext),
    [
      { delay: 0 },
      { delay: 500 },
    ],
    'should call setTimeout'
  )

  t.deepEquals(
    getClearTimeoutCalls(timeContext),
    [],
    'should not call clearTimeout'
  )

  tick()

  // Promise should be now resolved
  await p1

  tick()

  // Promise should be now resolved
  await p2
})


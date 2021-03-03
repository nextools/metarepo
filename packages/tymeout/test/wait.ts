/* eslint-disable no-param-reassign */
import test from 'tape'
import { makeSetTimeoutContext, makeSetTimeout, makeClearTimeout, tickTimeout, getSetTimeoutCalls, getClearTimeoutCalls } from 'time-test'
import { createSpy, getSpyCalls } from 'spyfn'
import { waitFactory } from '../src/wait'

test('wait', (t) => {
  const timeoutGetter = createSpy(((i = 0, v = [100, 200, 300]) => () => v[i++])())
  const cb = createSpy(() => {})

  const timeContext = makeSetTimeoutContext()
  const tick = tickTimeout(timeContext)

  const waiter = waitFactory(
    makeSetTimeout(timeContext),
    makeClearTimeout(timeContext)
  )(timeoutGetter)(cb)

  // Run waiter using getter
  waiter()

  // Get the unsubscribe function
  const unsub = waiter()

  // Override getter value
  waiter(500)

  t.deepEquals(
    getSetTimeoutCalls(timeContext),
    [
      { delay: 100 },
      { delay: 200 },
      { delay: 500 },
    ],
    'should call setTimeout'
  )

  t.deepEquals(
    getClearTimeoutCalls(timeContext),
    [],
    'should not call clearTimeout'
  )

  // Tick timeout
  tick(50)

  t.deepEquals(
    getSpyCalls(cb),
    [],
    'should not invoke callback'
  )

  // Add 100ms more
  tick(100)

  t.deepEquals(
    getSpyCalls(cb),
    [
      [],
    ],
    'should invoke callback'
  )

  // Unsubscribe
  unsub()

  // more time
  tick(1000)

  t.deepEquals(
    getSpyCalls(cb),
    [
      [],
      [],
    ],
    'should invoke callback'
  )

  t.deepEquals(
    getClearTimeoutCalls(timeContext),
    [
      { id: 1 },
    ],
    'should call clearTimeout'
  )

  t.end()
})

test('wait: no getter', (t) => {
  const cb = createSpy(() => {})

  const timeContext = makeSetTimeoutContext()
  const tick = tickTimeout(timeContext)

  const waiter = waitFactory(
    makeSetTimeout(timeContext),
    makeClearTimeout(timeContext)
  )()(cb)

  // Use default value
  waiter()

  // Get the unsubscribe function
  const unsub = waiter(100)

  // Use explicit time
  waiter(500)

  t.deepEquals(
    getSetTimeoutCalls(timeContext),
    [
      { delay: 0 },
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

  // Tick timeout
  tick(50)

  t.deepEquals(
    getSpyCalls(cb),
    [
      [],
    ],
    'should invoke callback'
  )

  // Unsubscribe
  unsub()

  // more time
  tick(1000)

  t.deepEquals(
    getSpyCalls(cb),
    [
      [],
      [],
    ],
    'should invoke callback'
  )

  t.deepEquals(
    getClearTimeoutCalls(timeContext),
    [
      { id: 1 },
    ],
    'should call clearTimeout'
  )

  t.end()
})

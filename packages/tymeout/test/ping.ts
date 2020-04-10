/* eslint-disable no-param-reassign */
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { tickTimeout, makeSetTimeoutContext, makeSetTimeout, makeClearTimeout, getSetTimeoutCalls, getClearTimeoutCalls } from 'time-test'
import { pingFactory } from '../src/ping'

test('ping', (t) => {
  const timeoutGetter = createSpy(((i = 0, v = [100, 200, 300]) => () => v[i++])())
  const cb = createSpy(() => {})

  const timeContext = makeSetTimeoutContext()
  const tick = tickTimeout(timeContext)

  const pinger = pingFactory(
    makeSetTimeout(timeContext),
    makeClearTimeout(timeContext)
  )(timeoutGetter)(cb)

  // Begin pinging
  const unsub = pinger()

  t.deepEquals(
    getSetTimeoutCalls(timeContext),
    [
      { delay: 100 },
    ],
    'should call setInterval'
  )

  tick(50)

  t.deepEquals(
    getSpyCalls(cb),
    [],
    'should not call spy'
  )

  tick()
  tick()
  unsub()
  tick()

  t.deepEquals(
    getSetTimeoutCalls(timeContext),
    [
      { delay: 100 },
      { delay: 200 },
      { delay: 300 },
    ],
    'should call setTimeout'
  )

  t.deepEquals(
    getClearTimeoutCalls(timeContext),
    [
      { id: 2 },
    ],
    'should call clearTimeout'
  )

  t.deepEquals(
    getSpyCalls(cb),
    [
      [],
      [],
    ],
    'should call spy'
  )

  t.end()
})

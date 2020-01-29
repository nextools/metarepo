import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { createTimeoutSpy } from 'spyt'
import { component, mapSafeTimeoutFactory, startWithType } from '../src'

test('mapSafeTimeout', (t) => {
  const timeoutSpy1 = createSpy(() => null)
  const timeoutSpy2 = createSpy(() => null)
  const timeoutSpy3 = createSpy(() => null)
  const timeout = createTimeoutSpy()
  const mapSafeTimeout = mapSafeTimeoutFactory(timeout.setTimeout, timeout.clearTimeout)
  const compSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(compSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: string }>(),
    mapSafeTimeout('setSafeTimeout')
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  const { setSafeTimeout } = getProps(0)

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', setSafeTimeout }],
    ],
    'Mount: should pass props'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <MyComp foo="bar"/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', setSafeTimeout }],
      [{ foo: 'bar', setSafeTimeout }],
    ],
    'Update: should pass props'
  )

  /* Call setTimeout */
  let unsub: any

  act(() => {
    setSafeTimeout(timeoutSpy1, 100)
    setSafeTimeout(timeoutSpy2, 70)
    unsub = setSafeTimeout(timeoutSpy3, 50)
  })

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [
      [100],
      [70],
      [50],
    ],
    'Call setTimeout: should call setTimeout'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Call setTimeout: should not call clearTimeout'
  )

  t.deepEquals(
    getSpyCalls(timeoutSpy1),
    [],
    'Call setTimeout: should not call timeoutSpy'
  )

  t.deepEquals(
    getSpyCalls(timeoutSpy2),
    [],
    'Call setTimeout: should not call timeoutSpy2'
  )

  t.deepEquals(
    getSpyCalls(timeoutSpy3),
    [],
    'Call setTimeout: should not call timeoutSpy3'
  )

  /* Cancel setTimeout */
  act(() => {
    unsub()
  })

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [
      [2],
    ],
    'Cancel setTimeout: should call clearTimeout'
  )

  /* Timeout Tick */
  act(() => {
    timeout.tick()
  })

  t.deepEquals(
    getSpyCalls(timeoutSpy1),
    [
      [],
    ],
    'Timeout Tick: should call timeoutSpy1'
  )

  t.deepEquals(
    getSpyCalls(timeoutSpy2),
    [
      [],
    ],
    'Timeout Tick: should call timeoutSpy2'
  )

  t.deepEquals(
    getSpyCalls(timeoutSpy3),
    [],
    'Timeout Tick: should not call timeoutSpy3'
  )

  act(() => {
    /* Call setTimeout before Unmount */
    setSafeTimeout(timeoutSpy1, 30)

    /* Unmount */
    testRenderer.unmount()
  })

  /* Call setTimeout after Unmount */
  act(() => {
    setSafeTimeout(timeoutSpy2, 80)
  })

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [
      [100],
      [70],
      [50],
      [30],
    ],
    'Unmount: should call setTimeout for timeoutSpy1'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [
      [2],
      [3],
    ],
    'Unmount: should call clearTimeout for timeoutSpy1'
  )

  /* Timeout Tick after Unmount */
  act(() => {
    timeout.tick()
  })

  t.deepEquals(
    getSpyCalls(timeoutSpy1),
    [
      [],
    ],
    'Timeout Tick after Unmount: should not call timeoutSpy1'
  )

  t.deepEquals(
    getSpyCalls(timeoutSpy2),
    [
      [],
    ],
    'Timeout Tick after Unmount: should not call timeoutSpy2'
  )

  t.deepEquals(
    getSpyCalls(timeoutSpy3),
    [],
    'Timeout Tick after Unmount: should not call timeoutSpy3'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

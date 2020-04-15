import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { createRafSpy } from 'spyt'
import { component, mapSafeRequestAnimationFrameFactory, startWithType } from '../src'

test('mapSafeRequestAnimationFrame', (t) => {
  const timeoutSpy1 = createSpy(() => null)
  const timeoutSpy2 = createSpy(() => null)
  const timeoutSpy3 = createSpy(() => null)
  const timeout = createRafSpy()
  const mapSafeRequestAnimationFrame = mapSafeRequestAnimationFrameFactory(timeout.requestAnimationFrame, timeout.cancelAnimationFrame)
  const componentSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(componentSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: string }>(),
    mapSafeRequestAnimationFrame('raf')
  )(componentSpy)

  /* Mount */
  let testRenderer: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  const { raf } = getProps(0)

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', raf }],
    ],
    'Mount: should pass props'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp foo="bar"/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', raf }],
      [{ foo: 'bar', raf }],
    ],
    'Update: should pass props'
  )

  let unsub: any

  /* Call setTimeout */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    raf(timeoutSpy1)
    raf(timeoutSpy2)
    unsub = raf(timeoutSpy3)
  })

  t.deepEquals(
    timeout.getRequestAnimationFrameCalls(),
    [
      [],
      [],
      [],
    ],
    'Call setTimeout: should call setTimeout'
  )

  t.deepEquals(
    timeout.getCancelAnimationFrameCalls(),
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    unsub()
  })

  t.deepEquals(
    timeout.getCancelAnimationFrameCalls(),
    [
      [2],
    ],
    'Cancel setTimeout: should call clearTimeout'
  )

  /* Timeout Tick */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    /* Call setTimeout before Unmount */
    raf(timeoutSpy1)

    /* Unmount */
    testRenderer.unmount()
  })

  /* Call setTimeout after Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    raf(timeoutSpy2)
  })

  t.deepEquals(
    timeout.getRequestAnimationFrameCalls(),
    [
      [],
      [],
      [],
      [],
    ],
    'Unmount: should call setTimeout for timeoutSpy1'
  )

  t.deepEquals(
    timeout.getCancelAnimationFrameCalls(),
    [
      [2],
      [3],
    ],
    'Unmount: should call clearTimeout for timeoutSpy1'
  )

  /* Timeout Tick after Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

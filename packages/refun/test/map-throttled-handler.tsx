import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { createTimeoutSpy } from 'spyt'
import { component, mapThrottledHandlerFactory, startWithType } from '../src'

test('mapThrottledHandler: Common usecases', (t) => {
  let spy = createSpy(() => null)
  const timeout = createTimeoutSpy()
  const mapThrottledHandler = mapThrottledHandlerFactory(timeout.setTimeout, timeout.clearTimeout)
  const componentSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(componentSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{
      handler: () => void, // eslint-disable-line func-call-spacing
      a: string,
      b: number,
    }>(),
    mapThrottledHandler('handler', 100)
  )(componentSpy)

  /* Mount */
  let testRenderer: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        handler={spy}
        a="foo"
        b={42}
      />
    )
  })

  const { handler } = getProps(0)

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ a: 'foo', b: 42, handler }],
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [],
    'Mount: should not set any delays'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Mount: should not call clearTimeout'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [],
    'Mount: should not call spy'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        handler={spy}
        a="bar"
        b={1337}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ a: 'foo', b: 42, handler }],
      [{ a: 'bar', b: 1337, handler }],
    ],
    'Update: should pass props and leave handler the same'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [],
    'Update: should not set any delays'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Update: should not call clearTimeout'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [],
    'Update: should not call spy'
  )

  /* Update Handler */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    spy = createSpy(() => null)

    testRenderer.update(
      <MyComp
        handler={spy}
        a="bar"
        b={1337}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ a: 'foo', b: 42, handler }],
      [{ a: 'bar', b: 1337, handler }],
      [{ a: 'bar', b: 1337, handler }],
    ],
    'Update Handler: should pass props and leave handler the same'
  )

  /* First Call */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    handler(42, 'foo')
  })

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [
      [100],
    ],
    'First Call: should set proper delay'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'First Call: should not call clearTimeout yet'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [],
    'First Call: should not call spy yet'
  )

  /* Second Call, interrupting first one */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    handler(13, 'bar')
  })

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Second Call, interrupting first one: should not clear previous timeout'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [[100]],
    'Second Call, interrupting first one: should not set new delay'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [],
    'Second Call, interrupting first one: should not call spy yet'
  )

  /* Timeout Tick */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    timeout.tick()
  })

  t.deepEquals(
    getSpyCalls(spy),
    [[13, 'bar']],
    'Timeout Tick: should call spy now'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Timeout Tick: should not call clearTimeout'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [[100]],
    'Timeout Tick: should not call setTimeout'
  )

  /* Third Call, after completing secont call timeout */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    handler('third call')
  })

  t.deepEquals(
    getSpyCalls(spy),
    [[13, 'bar']],
    'Third Call, after completing secont call timeout: should not call spy'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Third Call, after completing secont call timeout: should not call clearTimeout'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [[100], [100]],
    'Third Call, after completing secont call timeout: should call setTimeout'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(spy),
    [[13, 'bar']],
    'Unmount: should not call spy'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [[1]],
    'Unmount: should call clearTimeout'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [[100], [100]],
    'Unmount: should not call setTimeout'
  )

  /* Timeout Tick after Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    timeout.tick()
  })

  t.deepEquals(
    getSpyCalls(spy),
    [[13, 'bar']],
    'Timeout Tick after Unmount: should not call spy'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [[1]],
    'Timeout Tick after Unmount: should not call clearTimeout'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [[100], [100]],
    'Timeout Tick after Unmount: should not call setTimeout'
  )

  t.equals(
    getNumRenders(),
    3,
    'Render: should render component exact times'
  )

  t.end()
})

test('mapThrottledHandler: Invalid handler', (t) => {
  const timeout = createTimeoutSpy()
  const mapThrottledHandler = mapThrottledHandlerFactory(timeout.setTimeout, timeout.clearTimeout)
  const componentSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(componentSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ handler?: () => void }>(), // eslint-disable-line func-call-spacing
    mapThrottledHandler('handler', 50)
  )(componentSpy)

  /* Mount */
  let testRenderer: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp/>
    )
  })

  const { handler } = getProps(0)

  t.notEquals(
    handler,
    undefined,
    'Mount: should return valid handler'
  )

  /* Call handler */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    handler()
  })

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [],
    'Call handler: should not call setTimeout if no handler'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Call handler: should not call clearTimeout'
  )

  /* Timeout Tick */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    timeout.tick()
  })

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [],
    'Timeout Tick: should not call setTimeout'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Timeout Tick: should not call clearTimeout'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [],
    'Unmount: should not call setTimeout if no handler'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Unmount: should not call clearTimeout'
  )

  t.equals(
    getNumRenders(),
    1,
    'Render: should render component exact times'
  )

  t.end()
})

test('mapThrottledHandler: Handler is removed during timeout period', (t) => {
  const spy = createSpy(() => {})
  const timeout = createTimeoutSpy()
  const mapThrottledHandler = mapThrottledHandlerFactory(timeout.setTimeout, timeout.clearTimeout)
  const componentSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(componentSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ handler?: () => void }>(), // eslint-disable-line func-call-spacing
    mapThrottledHandler('handler', 50)
  )(componentSpy)

  /* Mount */
  let testRenderer: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp handler={spy}/>
    )
  })

  const { handler } = getProps(0)

  /* Call Handler */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    handler()
  })

  t.deepEquals(
    getSpyCalls(spy),
    [],
    'Call Handler: should not call original handler'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [
      [50],
    ],
    'Call Handler: should call setTimeout'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Call Handler: should not call clearTimeout'
  )

  /* Remove handler before Tick */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp/>
    )
  })

  t.deepEquals(
    getSpyCalls(spy),
    [],
    'Remove handler before Tick: should not call original handler'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [
      [50],
    ],
    'Remove handler before Tick: should not call setTimeout'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Remove handler before Tick: should not call clearTimeout'
  )

  /* Timeout Tick */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    timeout.tick()
  })

  t.deepEquals(
    getSpyCalls(spy),
    [],
    'Timeout Tick: should not call original handler'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [
      [50],
    ],
    'Timeout Tick: should not call setTimeout'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Timeout Tick: should not call clearTimeout'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(spy),
    [],
    'Timeout Tick: should not call original handler'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [
      [50],
    ],
    'Timeout Tick: should not call setTimeout'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Timeout Tick: should not call clearTimeout'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

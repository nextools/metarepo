import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { createTimeoutSpy } from 'spyt'
import { component, mapDebouncedHandlerFactory, startWithType } from '../src'

test('mapDebouncedHandler: Common usecases', (t) => {
  let handlerSpy = createSpy(() => null)
  const compSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(compSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const timeout = createTimeoutSpy()
  const mapDebouncedHandler = mapDebouncedHandlerFactory(timeout.setTimeout, timeout.clearTimeout)

  const MyComp = component(
    startWithType<{
      handler: () => void, // eslint-disable-line func-call-spacing
      a: string,
      b: number,
    }>(),
    mapDebouncedHandler('handler', 100)
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        handler={handlerSpy}
        a="foo"
        b={42}
      />
    )
  })

  const { handler } = getProps(0)

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{
        handler,
        a: 'foo',
        b: 42,
      }],
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
    getSpyCalls(handlerSpy),
    [],
    'Mount: should not call spy'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <MyComp
        handler={handlerSpy}
        a="bar"
        b={1337}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{
        handler,
        a: 'foo',
        b: 42,
      }],
      [{
        handler,
        a: 'bar',
        b: 1337,
      }],
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
    getSpyCalls(handlerSpy),
    [],
    'Update: should not call spy'
  )

  /* Update Handler */
  act(() => {
    handlerSpy = createSpy(() => null)

    testRenderer.update(
      <MyComp
        handler={handlerSpy}
        a="bar"
        b={1337}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{
        handler,
        a: 'foo',
        b: 42,
      }],
      [{
        handler,
        a: 'bar',
        b: 1337,
      }],
      [{
        handler,
        a: 'bar',
        b: 1337,
      }],
    ],
    'Update Handler: should pass props and leave handler the same'
  )

  /* First Call */
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
    getSpyCalls(handlerSpy),
    [],
    'First Call: should not call spy yet'
  )

  /* Second Call, interrupting first one */
  act(() => {
    handler(13, 'bar')
  })

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [
      [0],
    ],
    'Second Call, interrupting first one: should clear previous timeout'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [
      [100],
      [100],
    ],
    'Second Call, interrupting first one: should set proper delay'
  )

  t.deepEquals(
    getSpyCalls(handlerSpy),
    [],
    'Second Call, interrupting first one: should not call spy yet'
  )

  /* Timeout Tick */
  act(() => {
    timeout.tick()
  })

  t.deepEquals(
    getSpyCalls(handlerSpy),
    [
      [13, 'bar'],
    ],
    'Timeout Tick: should call spy now'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [
      [0],
    ],
    'Timeout Tick: should not call clearTimeout'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [
      [100],
      [100],
    ],
    'Timeout Tick: should not call setTimeout'
  )

  /* Third Call, after completing secont call timeout */
  act(() => {
    handler('third call')
  })

  t.deepEquals(
    getSpyCalls(handlerSpy),
    [
      [13, 'bar'],
    ],
    'Third Call, after completing secont call timeout: should not call spy'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [
      [0],
    ],
    'Third Call, after completing secont call timeout: should not call clearTimeout'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [
      [100],
      [100],
      [100],
    ],
    'Third Call, after completing secont call timeout: should call setTimeout'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(handlerSpy),
    [
      [13, 'bar'],
    ],
    'Unmount: should not call spy'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [
      [0],
      [2],
    ],
    'Unmount: should call clearTimeout'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [
      [100],
      [100],
      [100],
    ],
    'Unmount: should not call setTimeout'
  )

  /* Timeout Tick after Unmount */
  act(() => {
    timeout.tick()
  })

  t.deepEquals(
    getSpyCalls(handlerSpy),
    [
      [13, 'bar'],
    ],
    'Timeout Tick after Unmount: should not call spy'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [
      [0],
      [2],
    ],
    'Timeout Tick after Unmount: should not call clearTimeout'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [
      [100],
      [100],
      [100],
    ],
    'Timeout Tick after Unmount: should not call setTimeout'
  )

  t.equals(
    getNumRenders(),
    3,
    'Render: should render component exact times'
  )

  t.end()
})

test('mapDebouncedHandler: Invalid handler', (t) => {
  const timeout = createTimeoutSpy()
  const mapDebouncedHandler = mapDebouncedHandlerFactory(timeout.setTimeout, timeout.clearTimeout)
  const compSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(compSpy)[renderIndex][0]
  const MyComp = component(
    startWithType<{ handler?: () => void }>(), // eslint-disable-line func-call-spacing
    mapDebouncedHandler('handler', 50)
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

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
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [],
    'Unmount: should not call setTimeout'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Unmount: should not call clearTimeout'
  )

  t.end()
})

test('mapDebouncedHandler: Handler is removed during timeout period', (t) => {
  const spy = createSpy(() => {})
  const timeout = createTimeoutSpy()
  const mapDebouncedHandler = mapDebouncedHandlerFactory(timeout.setTimeout, timeout.clearTimeout)
  const compSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(compSpy)[renderIndex][0]
  const MyComp = component(
    startWithType<{ handler?: () => void }>(), // eslint-disable-line func-call-spacing
    mapDebouncedHandler('handler', 50)
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp handler={spy}/>
    )
  })

  const { handler } = getProps(0)

  /* Call Handler */
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
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(spy),
    [],
    'Unmount: should not call original handler'
  )

  t.deepEquals(
    timeout.getSetTimeoutCalls(),
    [
      [50],
    ],
    'Unmount: should not call setTimeout'
  )

  t.deepEquals(
    timeout.getClearTimeoutCalls(),
    [],
    'Unmount: should not call clearTimeout'
  )

  t.end()
})

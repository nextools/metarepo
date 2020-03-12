import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, startWithType, onMount } from '../src'

test('onMount: sync function', (t) => {
  const unmountSpy = createSpy(() => null)
  const mountSpy = createSpy(() => unmountSpy) as () => void
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: string }>(),
    onMount(mountSpy)
  )(compSpy)

  let testRenderer!: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mountSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Mount: should call mount'
  )

  t.deepEquals(
    getSpyCalls(unmountSpy),
    [],
    'Mount: should not call unmount'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp foo="bar"/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'bar' }],
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mountSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Update: should not call mount anymore'
  )

  t.deepEquals(
    getSpyCalls(unmountSpy),
    [],
    'Update: should not call unmount'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(mountSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Unmount: should not call mount anymore'
  )

  t.deepEquals(
    getSpyCalls(unmountSpy),
    [],
    'Unmount: should not call unmount'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

test('onMount: async function', (t) => {
  const mountSpy = createSpy(async () => {})
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: string }>(),
    onMount(mountSpy)
  )(compSpy)

  let testRenderer!: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mountSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Mount: should call mount'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp foo="bar"/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'bar' }],
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mountSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Update: should not call mount anymore'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(mountSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Unmount: should not call mount anymore'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

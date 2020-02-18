import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, startWithType, onUnmount } from '../src'

test('onUnmount: sync function', (t) => {
  const unmountSpy = createSpy(() => {})
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: string }>(),
    onUnmount(unmountSpy)
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

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
    getSpyCalls(unmountSpy),
    [],
    'Mount: should not call unmount'
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
      [{ foo: 'foo' }],
      [{ foo: 'bar' }],
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(unmountSpy),
    [],
    'Update: should not call unmount'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(unmountSpy),
    [
      [{ foo: 'bar' }],
    ],
    'Unmount: should call unmount and pass latest props'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

test('onUnmount: sync function', (t) => {
  const unmountSpy = createSpy(async () => {})
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: string }>(),
    onUnmount(unmountSpy)
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

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
    getSpyCalls(unmountSpy),
    [],
    'Mount: should not call unmount'
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
      [{ foo: 'foo' }],
      [{ foo: 'bar' }],
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(unmountSpy),
    [],
    'Update: should not call unmount'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(unmountSpy),
    [
      [{ foo: 'bar' }],
    ],
    'Unmount: should call unmount and pass latest props'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

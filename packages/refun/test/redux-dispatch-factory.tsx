import React, { createContext } from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { Store } from 'redux'
import { component, ReduxDispatchFactory, startWithType } from '../src'

test('ReduxDispatchFactory', (t) => {
  const dispatch = (_: any) => _
  const componentSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const store = { dispatch, getState: void 0 as any, subscribe: void 0 as any } as Store<{a: number, b: string}>
  const MyComp = component(
    startWithType<{ foo: string }>(),
    ReduxDispatchFactory(createContext(store))('disp')
  )(componentSpy)

  let testRenderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', disp: dispatch }], // Mount
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
      [{ foo: 'foo', disp: dispatch }], // Mount
      [{ foo: 'bar', disp: dispatch }], // Update
    ],
    'Update: should pass props'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

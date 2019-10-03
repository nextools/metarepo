import React, { createContext } from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, ReduxDispatchFactory, startWithType } from '../src'

test('ReduxDispatchFactory', (t) => {
  const dispatch = (_: any) => _
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const Context = createContext({ state: {}, dispatch })
  const MyComp = component(
    startWithType<{ foo: string }>(),
    ReduxDispatchFactory(Context)
  )(compSpy)

  /* Mount */
  let testRenderer: any
  act(() => {
    testRenderer = TestRenderer.create(
      <Context.Provider value={{ state: {}, dispatch }}>
        <MyComp foo="foo"/>
      </Context.Provider>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', dispatch }], // Mount
    ],
    'Mount: should pass props'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <Context.Provider value={{ state: {}, dispatch }}>
        <MyComp
          foo="bar"
        />
      </Context.Provider>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', dispatch }], // Mount
      [{ foo: 'bar', dispatch }], // Update
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

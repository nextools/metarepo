import React, { createContext } from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, mapContext, startWithType } from '../src'

test('mapContext', (t) => {
  const compSpy = createSpy(() => null)
  const Context = createContext({ ctxA: 'foo', ctxB: 42 })
  const MyComp = component(
    startWithType<{ foo: string }>(),
    mapContext(Context)
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <Context.Provider value={{ ctxA: 'foo', ctxB: 42 }}>
        <MyComp foo="bar"/>
      </Context.Provider>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ ctxA: 'foo', ctxB: 42, foo: 'bar' }],
    ],
    'Mount: should pass context as props'
  )

  /* Update Context */
  act(() => {
    testRenderer.update(
      <Context.Provider value={{ ctxA: 'bar', ctxB: 1337 }}>
        <MyComp foo="bar"/>
      </Context.Provider>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ ctxA: 'foo', ctxB: 42, foo: 'bar' }],
      [{ ctxA: 'bar', ctxB: 1337, foo: 'bar' }],
    ],
    'Update Context: should pass context as props'
  )

  t.end()
})

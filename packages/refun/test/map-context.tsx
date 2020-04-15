import React, { createContext } from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, mapContext, startWithType } from '../src'

test('mapContext', (t) => {
  const componentSpy = createSpy(() => null)
  const Context = createContext({ ctxA: 'foo', ctxB: 42 })
  const MyComp = component(
    startWithType<{ foo: string }>(),
    mapContext(Context)
  )(componentSpy)

  let testRenderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <Context.Provider value={{ ctxA: 'foo', ctxB: 42 }}>
        <MyComp foo="bar"/>
      </Context.Provider>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ ctxA: 'foo', ctxB: 42, foo: 'bar' }], // Mount
    ],
    'Mount: should pass context as props'
  )

  /* Update Context */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <Context.Provider value={{ ctxA: 'bar', ctxB: 1337 }}>
        <MyComp foo="bar"/>
      </Context.Provider>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ ctxA: 'foo', ctxB: 42, foo: 'bar' }], // Mount
      [{ ctxA: 'bar', ctxB: 1337, foo: 'bar' }], // Update Context
    ],
    'Update Context: should pass context as props'
  )

  t.end()
})

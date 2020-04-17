import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, startWithType, mapWithProps } from '../src'

test('mapWithProps', (t) => {
  const spy = createSpy(({ args }) => ({ bar: args[0].foo * 2 }))
  const componentSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: number }>(),
    mapWithProps(spy)
  )(componentSpy)

  /* Mount */
  let testRenderer: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo={2}/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 2, bar: 4 }],
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 2 }],
    ],
    'Mount: should call map function'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp foo={3}/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 2, bar: 4 }],
      [{ foo: 3, bar: 6 }],
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 2 }],
      [{ foo: 3 }],
    ],
    'Update: should call map function'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 2 }],
      [{ foo: 3 }],
    ],
    'Unmount: should not call map function'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

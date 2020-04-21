import React, { createContext } from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { Store } from 'redux'
import { component, ReduxStateFactory, startWithType } from '../src'

test('ReduxStateFactory', (t) => {
  const dispatch = (_: any) => _
  let subscriber: any
  const unsubscribeSpy = createSpy(() => {})
  const subscribeSpy = createSpy(({ args }) => {
    subscriber = args[0]

    return unsubscribeSpy
  })
  const stateValues = [
    { a: 4, b: '' }, // initial value
    { a: 4, b: 'bar' }, // update unwatched value
    { a: 8, b: 'bar' }, // update watched value
  ]
  const getStateSpy = createSpy(({ index }) => stateValues[index])
  const mapStateSpy = createSpy(({ args }) => ({ result: args[0].a * 2 }))
  const componentSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const store = { dispatch, getState: getStateSpy, subscribe: subscribeSpy } as Store<{a: number, b: string}>
  const MyComp = component(
    startWithType<{ foo: string }>(),
    ReduxStateFactory(createContext(store))(mapStateSpy, ['a'])
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
      [{ foo: 'foo', result: 8 }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }], // Mount
    ],
    'Mount: should call map function'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', result: 8 }], // Mount
      [{ foo: 'bar', result: 8 }], // Update
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }], // Mount
    ],
    'Update: should not call map function'
  )

  /* Update unwatched values */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    subscriber()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', result: 8 }], // Mount
      [{ foo: 'bar', result: 8 }], // Update
    ],
    'Update unwatched values: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }], // Mount
    ],
    'Update unwatched values: should not call map function'
  )

  /* Update watched values */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    subscriber()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', result: 8 }], // Mount
      [{ foo: 'bar', result: 8 }], // Update
      [{ foo: 'bar', result: 16 }], // Update watched values
    ],
    'Update watched values: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }], // Mount
      [{ a: 8, b: 'bar' }], // Update watched values
    ],
    'Update watched values: should call map function'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }], // Mount
      [{ a: 8, b: 'bar' }], // Update watched values
    ],
    'Unmount: should not call map function'
  )

  t.equals(
    getNumRenders(),
    3,
    'Render: should render component exact times'
  )

  t.end()
})

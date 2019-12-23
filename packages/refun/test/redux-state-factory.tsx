import React, { createContext } from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, ReduxStateFactory, startWithType } from '../src'

test('ReduxStateFactory', (t) => {
  const dispatch = (_: any) => _
  const mapStateSpy = createSpy(({ args }) => ({ result: args[0].a * 2 }))
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const Context = createContext({ state: { a: 4, b: '' }, dispatch })
  const MyComp = component(
    startWithType<{ foo: string }>(),
    ReduxStateFactory(Context)(mapStateSpy, ['a'])
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer
  act(() => {
    testRenderer = TestRenderer.create(
      <Context.Provider value={{ state: { a: 4, b: '' }, dispatch }}>
        <MyComp foo="foo"/>
      </Context.Provider>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', result: 8 }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }],
    ],
    'Mount: should call map function'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <Context.Provider value={{ state: { a: 4, b: '' }, dispatch }}>
        <MyComp
          foo="bar"
        />
      </Context.Provider>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', result: 8 }], // Mount
      [{ foo: 'bar', result: 8 }], // Update
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }],
    ],
    'Update: should not call map function'
  )

  /* Update unwatched values */
  act(() => {
    testRenderer.update(
      <Context.Provider value={{ state: { a: 4, b: 'b' }, dispatch }}>
        <MyComp foo="bar"/>
      </Context.Provider>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', result: 8 }], // Mount
      [{ foo: 'bar', result: 8 }], // Update
      [{ foo: 'bar', result: 8 }], // Update Context unwatched values
    ],
    'Update unwatched values: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }],
    ],
    'Update unwatched values: should not call map function'
  )

  /* Update Context watched values */
  act(() => {
    testRenderer.update(
      <Context.Provider value={{ state: { a: 8, b: 'b' }, dispatch }}>
        <MyComp foo="bar"/>
      </Context.Provider>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', result: 8 }], // Mount
      [{ foo: 'bar', result: 8 }], // Update
      [{ foo: 'bar', result: 8 }], // Update Context unwatched values
      [{ foo: 'bar', result: 16 }], // Update Context watched values
    ],
    'Update watched values: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }],
      [{ a: 8, b: 'b' }],
    ],
    'Update watched values: should call map function'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }],
      [{ a: 8, b: 'b' }],
    ],
    'Unmount: should not call map function'
  )

  t.equals(
    getNumRenders(),
    4,
    'Render: should render component exact times'
  )

  t.end()
})

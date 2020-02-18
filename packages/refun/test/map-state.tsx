import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, mapState, startWithType } from '../src'

test('mapState', (t) => {
  const compSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(compSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const spy = createSpy(({ args }) => [args[0].foo * 2])
  const MyComp = component(
    startWithType<{
      foo: number,
      bar?: string,
    }>(),
    mapState('state', 'setState', spy, ['foo'])
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={1}
      />
    )
  })

  const { state, setState } = getProps(0)

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 1, state: [2], setState }],
    ],
    'Mount: should pass props, state and state-setter'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 1 }],
    ],
    'Mount: should call map function'
  )

  /* Update unwatched props */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={1}
        bar="bar"
      />
    )
  })

  t.equals(
    getProps(1).state,
    state,
    'Update unwatched props: should pass same state instance'
  )

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 1, state: [2], setState }],
      [{ foo: 1, bar: 'bar', state, setState }],
    ],
    'Update unwatched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 1 }],
    ],
    'Update unwatched props: should not call map function'
  )

  /* Update watched props */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
        bar="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 1, state: [2], setState }],
      [{ foo: 1, bar: 'bar', state, setState }],
      [{ foo: 4, bar: 'bar', state: [2], setState }],
      [{ foo: 4, bar: 'bar', state: [8], setState }],
    ],
    'Update watched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 1 }],
      [{ foo: 4, bar: 'bar' }],
    ],
    'Update watched props: should call map function'
  )

  /* Update state */
  act(() => {
    setState([10])
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 1, state: [2], setState }],
      [{ foo: 1, bar: 'bar', state, setState }],
      [{ foo: 4, bar: 'bar', state: [2], setState }],
      [{ foo: 4, bar: 'bar', state: [8], setState }],
      [{ foo: 4, bar: 'bar', state: [10], setState }],
    ],
    'Update state: should update state, but leave state-setter same'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 1 }],
      [{ foo: 4, bar: 'bar' }],
    ],
    'Update state: should not call map function'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 1 }],
      [{ foo: 4, bar: 'bar' }],
    ],
    'Unmount: should not call map function'
  )

  t.equals(
    getNumRenders(),
    5,
    'Render: should render component exact times'
  )

  t.end()
})

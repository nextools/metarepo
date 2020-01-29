import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, startWithType, mapRef } from '../src'

test('mapRef', (t) => {
  const compSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(compSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{
      foo: number,
      bar?: string,
    }>(),
    mapRef('valueRef', 42)
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={2}
      />
    )
  })

  const { valueRef } = getProps(0)

  t.deepEquals(
    valueRef.current,
    42,
    'Mount: should pass ref'
  )

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2, valueRef }],
    ],
    'Mount: should pass props'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2, valueRef }],
      [{ foo: 4, valueRef }],
    ],
    'Update: should pass props'
  )

  /* Write to Ref */
  act(() => {
    valueRef.current = 99
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2, valueRef }],
      [{ foo: 4, valueRef }],
    ],
    'Write to Ref: should not rerender'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

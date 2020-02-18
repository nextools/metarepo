import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { getSpyCalls, createSpy } from 'spyfn'
import { component, mapDefaultProps, startWithType } from '../src'

test('mapDefaultProps', (t) => {
  const compSpy = createSpy(() => null)
  const MyComp = component(
    startWithType<{
      a?: string,
      b?: number,
      c?: boolean,
    }>(),
    mapDefaultProps({
      a: 'foo',
      b: 42,
    })
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ a: 'foo', b: 42 }],
    ],
    'Mount: should pass props'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <MyComp
        a="somevalue"
        c
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ a: 'foo', b: 42 }],
      [{ a: 'somevalue', b: 42, c: true }],
    ],
    'Update: should pass props'
  )

  t.end()
})

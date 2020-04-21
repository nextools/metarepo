import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { getSpyCalls, createSpy } from 'spyfn'
import { component, mapDefaultProps, startWithType } from '../src'

test('mapDefaultProps', (t) => {
  const componentSpy = createSpy(() => null)
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
  )(componentSpy)

  /* Mount */
  let testRenderer: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ a: 'foo', b: 42 }],
    ],
    'Mount: should pass props'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        a="somevalue"
        c
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ a: 'foo', b: 42 }],
      [{ a: 'somevalue', b: 42, c: true }],
    ],
    'Update: should pass props'
  )

  t.end()
})

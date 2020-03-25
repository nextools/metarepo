import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { component, startWithType } from '../src'

test('startWithType', (t) => {
  const MyComp = component(
    startWithType<{ foo: string }>()
  )((props) => <span {...props}/>)

  let testRenderer!: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  t.deepEquals(
    testRenderer.root.findByType('span').props,
    {
      foo: 'foo',
    },
    'Mount: should pass props'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp foo="bar"/>
    )
  })

  t.deepEquals(
    testRenderer.root.findByType('span').props,
    {
      foo: 'bar',
    },
    'Update: should pass props'
  )

  t.end()
})

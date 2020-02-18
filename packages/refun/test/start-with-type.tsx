import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { component, startWithType } from '../src'

test('startWithType', (t) => {
  const MyComp = component(
    startWithType<{ foo: string }>()
  )((props) => <span {...props}/>)

  /* Mount */
  let testRenderer!: ReactTestRenderer

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

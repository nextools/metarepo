import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { pureComponent, startWithType } from '../src'

test('pureComponent: props', (t) => {
  const mapSpy = createSpy(({ args }) => args[0])
  const compSpy = createSpy(() => null)
  const MyComp = pureComponent(mapSpy)(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Mount: should call map functions'
  )
  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Mount: should pass props'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <MyComp foo="bar"/>
    )
  })

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'bar' }],
    ],
    'Update: should call map functions'
  )

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'bar' }],
    ],
    'Update: should pass props'
  )

  /* Pure Update */
  act(() => {
    testRenderer.update(
      <MyComp foo="bar"/>
    )
  })

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'bar' }],
      [{ foo: 'bar' }],
    ],
    'Pure Update: should call map functions'
  )

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'bar' }],
    ],
    'Pure Update: should not render component'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'bar' }],
      [{ foo: 'bar' }],
    ],
    'Unmount: should not call map functions'
  )

  t.end()
})

test('pureComponent: multiple map functions', (t) => {
  const compSpy = createSpy(() => null)
  const MyComp = pureComponent(
    startWithType<{ initial: number }>(),
    ({ initial }) => ({ foo: `foo${initial}` }),
    ({ foo }) => ({ bar: `${foo}bar` })
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp initial={2}/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ bar: 'foo2bar' }],
    ],
    'Mount: should render component with props'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <MyComp initial={4}/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ bar: 'foo2bar' }],
      [{ bar: 'foo4bar' }],
    ],
    'Update: should render component with props'
  )

  /* Pure Update */
  act(() => {
    testRenderer.update(
      <MyComp initial={4}/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ bar: 'foo2bar' }],
      [{ bar: 'foo4bar' }],
    ],
    'Pure Update: should not rerender component if props didnt change'
  )

  t.end()
})

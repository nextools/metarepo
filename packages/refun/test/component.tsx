import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, startWithType } from '../src'

test('component: props', (t) => {
  const mapSpy = createSpy(({ args }) => (args[0]))
  const compSpy = createSpy(() => null)
  const MyComp = component(mapSpy)(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
      [{ foo: 'bar' }],
    ],
    'Pure Update: should pass props'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

test('component: multiple map functions', (t) => {
  const compSpy = createSpy(() => null)
  const MyComp = component(
    startWithType<{ initial: number }>(),
    ({ initial }) => ({ foo: `foo${initial}` }),
    ({ foo }) => ({ bar: `${foo}bar` })
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
    'Mount: should map props'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
    'Update: should map props'
  )

  t.end()
})

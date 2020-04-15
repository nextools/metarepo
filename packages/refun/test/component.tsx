import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, startWithType } from '../src'

test('component: props', (t) => {
  const mapSpy = createSpy(({ args }) => (args[0]))
  const componentSpy = createSpy(() => null)
  const MyComp = component(mapSpy)(componentSpy)

  let testRenderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Mount: should call map functions'
  )

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
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
      [{ foo: 'foo' }], // Mount
      [{ foo: 'bar' }], // Update
    ],
    'Update: should call map functions'
  )

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
      [{ foo: 'bar' }], // Update
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
      [{ foo: 'foo' }], // Mount
      [{ foo: 'bar' }], // Update
      [{ foo: 'bar' }], // Pure Update
    ],
    'Pure Update: should call map functions'
  )

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
      [{ foo: 'bar' }], // Update
      [{ foo: 'bar' }], // Pure Update
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
      [{ foo: 'foo' }], // Mount
      [{ foo: 'bar' }], // Update
      [{ foo: 'bar' }], // Pure Update
    ],
    'Unmount: should not call map functions'
  )

  t.end()
})

test('component: multiple map functions', (t) => {
  const componentSpy = createSpy(() => null)
  const MyComp = component(
    startWithType<{ initial: number }>(),
    ({ initial }) => ({ foo: `foo${initial}` }),
    ({ foo }) => ({ bar: `${foo}bar` })
  )(componentSpy)

  let testRenderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp initial={2}/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ bar: 'foo2bar' }], // Mount
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
    getSpyCalls(componentSpy),
    [
      [{ bar: 'foo2bar' }], // Mount
      [{ bar: 'foo4bar' }], // Update
    ],
    'Update: should map props'
  )

  t.end()
})

import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, startWithType, onChange } from '../src'

test('onChange: sync function', (t) => {
  const onChangeSpy = createSpy(() => {})
  const componentSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{
      foo: string,
      watch?: string,
    }>(),
    onChange(onChangeSpy, ['watch'])
  )(componentSpy)

  let testRenderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onChangeSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Mount: should call update'
  )

  /* Update unwatched props */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
      [{ foo: 'bar' }], // Update not watched prop
    ],
    'Update unwatched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onChangeSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Update unwatched props: should not call update'
  )

  /* Update watched props */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo="bar"
        watch="watch"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
      [{ foo: 'bar' }], // Update not watched prop
      [{ foo: 'bar', watch: 'watch' }], // Update watched prop
    ],
    'Update watched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onChangeSpy),
    [
      [{ foo: 'foo' }], // Mount
      [{ foo: 'bar', watch: 'watch' }], // Update watched prop
    ],
    'Update watched props: should call update'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onChangeSpy),
    [
      [{ foo: 'foo' }], // Mount
      [{ foo: 'bar', watch: 'watch' }], // Update watched prop
    ],
    'Unmount: should not call update'
  )

  t.equals(
    getNumRenders(),
    3,
    'Render: should render component exact times'
  )

  t.end()
})

test('onChange: async function', (t) => {
  const onChangeSpy = createSpy(async () => {})
  const componentSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{
      foo: string,
      watch?: string,
    }>(),
    onChange(onChangeSpy, ['watch'])
  )(componentSpy)

  /* Mount */
  let testRenderer: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo="foo"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onChangeSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Mount: should call update'
  )

  /* Update not watched prop */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo="foo"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
      [{ foo: 'foo' }], // Update not watched prop
    ],
    'Update not watched prop: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onChangeSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Update not watched prop: should not call update if changed props were not watched'
  )

  /* Update watched prop */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo="foo"
        watch="watch"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
      [{ foo: 'foo' }], // Update not watched prop
      [{ foo: 'foo', watch: 'watch' }], // Update watched prop
    ],
    'Update watched prop: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onChangeSpy),
    [
      [{ foo: 'foo' }], // Mount
      [{ foo: 'foo', watch: 'watch' }], // Update watched values
    ],
    'Update watched prop: should call update if changed props were watched'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onChangeSpy),
    [
      [{ foo: 'foo' }], // Mount
      [{ foo: 'foo', watch: 'watch' }], // Update watched values
    ],
    'Unmount: should not call update'
  )

  t.equals(
    getNumRenders(),
    3,
    'Render: should render component exact times'
  )

  t.end()
})

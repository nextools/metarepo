import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, startWithType, onChange } from '../src'

test('onChange: sync function', (t) => {
  const updateSpy = createSpy(() => {})
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{
      foo: string,
      watch?: string,
    }>(),
    onChange(updateSpy, ['watch'])
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Mount: should call update'
  )

  /* Update unwatched props */
  act(() => {
    testRenderer.update(
      <MyComp
        foo="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'bar' }],
    ],
    'Update unwatched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Update unwatched props: should not call update'
  )

  /* Update watched props */
  act(() => {
    testRenderer.update(
      <MyComp
        foo="bar"
        watch="watch"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'bar' }],
      [{ foo: 'bar', watch: 'watch' }],
    ],
    'Update watched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'bar', watch: 'watch' }],
    ],
    'Update watched props: should call update'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(updateSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'bar', watch: 'watch' }],
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
  const updateSpy = createSpy(async () => {})
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{
      foo: string,
      watch?: string,
    }>(),
    onChange(updateSpy, ['watch'])
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo="foo"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Mount: should call update'
  )

  /* Update not watched prop */
  act(() => {
    testRenderer.update(
      <MyComp
        foo="foo"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'foo' }],
    ],
    'Update not watched prop: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [
      [{ foo: 'foo' }],
    ],
    'Update not watched prop: should not call update if changed props were not watched'
  )

  /* Update watched prop */
  act(() => {
    testRenderer.update(
      <MyComp
        foo="foo"
        watch="watch"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'foo' }],
      [{ foo: 'foo', watch: 'watch' }],
    ],
    'Update watched prop: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'foo', watch: 'watch' }],
    ],
    'Update watched prop: should call update if changed props were watched'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(updateSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'foo', watch: 'watch' }],
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

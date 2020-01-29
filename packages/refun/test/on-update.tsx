import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, startWithType, onUpdate } from '../src'

test('onUpdate: sync function, empty watch keys', (t) => {
  const updateSpy = createSpy(() => {})
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: string }>(),
    onUpdate(updateSpy, [])
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
    [],
    'Mount: should not call update'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <MyComp foo="bar"/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'bar' }],
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [],
    'Update: should not call update if array was empty'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(updateSpy),
    [],
    'Unmount: should not call update'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

test('onUpdate: sync function, watch keys', (t) => {
  const updateSpy = createSpy(() => {})
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: string, bar: string }>(),
    onUpdate(updateSpy, ['foo'])
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo="foo"
        bar="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', bar: 'bar' }],
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [],
    'Mount: should not call update'
  )

  /* Update not watched prop */
  act(() => {
    testRenderer.update(
      <MyComp
        foo="foo"
        bar="baz"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', bar: 'bar' }],
      [{ foo: 'foo', bar: 'baz' }],
    ],
    'Update not watched prop: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [],
    'Update not watched prop: should not call update if changed props were not watched'
  )

  /* Update watched prop */
  act(() => {
    testRenderer.update(
      <MyComp
        foo="bar"
        bar="baz"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', bar: 'bar' }],
      [{ foo: 'foo', bar: 'baz' }],
      [{ foo: 'bar', bar: 'baz' }],
    ],
    'Update watched prop: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [
      [{ foo: 'bar', bar: 'baz' }],
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
      [{ foo: 'bar', bar: 'baz' }],
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

test('onUpdate: async function, empty watch keys', (t) => {
  const updateSpy = createSpy(async () => {})
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: string }>(),
    onUpdate(updateSpy, [])
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
    [],
    'Mount: should not call update'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <MyComp foo="bar"/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo' }],
      [{ foo: 'bar' }],
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [],
    'Update: should not call update if array was empty'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(updateSpy),
    [],
    'Unmount: should not call update'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

test('onUpdate: async function, watch keys', (t) => {
  const updateSpy = createSpy(async () => {})
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: string, bar: string }>(),
    onUpdate(updateSpy, ['foo'])
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo="foo"
        bar="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', bar: 'bar' }],
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [],
    'Mount: should not call update'
  )

  /* Update not watched prop */
  act(() => {
    testRenderer.update(
      <MyComp foo="foo" bar="baz"/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', bar: 'bar' }],
      [{ foo: 'foo', bar: 'baz' }],
    ],
    'Update not watched prop: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [],
    'Update not watched prop: should not call update if changed props were not watched'
  )

  /* Update watched prop */
  act(() => {
    testRenderer.update(
      <MyComp foo="bar" bar="baz"/>
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', bar: 'bar' }],
      [{ foo: 'foo', bar: 'baz' }],
      [{ foo: 'bar', bar: 'baz' }],
    ],
    'Update watched prop: should pass props'
  )

  t.deepEquals(
    getSpyCalls(updateSpy),
    [
      [{ foo: 'bar', bar: 'baz' }],
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
      [{ foo: 'bar', bar: 'baz' }],
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

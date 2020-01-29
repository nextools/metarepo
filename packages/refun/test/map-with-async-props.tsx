import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, startWithType, mapWithAsyncProps } from '../src'

test('mapWithAsyncProps', async (t) => {
  let resolve: any
  const spy = createSpy(({ args }) => new Promise<{ result: number }>((r) => {
    resolve = () => r({ result: args[0].foo * 2 })
  }))
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{
      foo: number,
      bar?: string,
    }>(),
    mapWithAsyncProps(spy, ['foo'])
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={2}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2 }],
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 2 }],
    ],
    'Mount: should call map function'
  )

  /* Update unwatched props */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={2}
        bar="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2 }],
      [{ foo: 2, bar: 'bar' }],
    ],
    'Update unwatched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 2 }],
    ],
    'Update unwatched props: should not call map function'
  )

  /* Update watched props */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
        bar="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2 }],
      [{ foo: 2, bar: 'bar' }],
      [{ foo: 4, bar: 'bar' }],
    ],
    'Update watched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 2 }],
      [{ foo: 4, bar: 'bar' }],
    ],
    'Update watched props: should call map function'
  )

  /* Resolve Promise */
  await act(async () => {
    await resolve()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2 }],
      [{ foo: 2, bar: 'bar' }],
      [{ foo: 4, bar: 'bar' }],
      [{ foo: 4, bar: 'bar', result: 8 }],
    ],
    'Resolve Promise: should pass props'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 2 }],
      [{ foo: 4, bar: 'bar' }],
    ],
    'Unount: should not call map function'
  )

  t.equals(
    getNumRenders(),
    4,
    'Render: should render component exact times'
  )
})

test('mapWithAsyncProps: null case', async (t) => {
  let resolve: any
  const mapAsyncSpy = createSpy(() => new Promise<{ result: number }>((r) => {
    resolve = () => r(null as any)
  }))
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{
      foo: number,
      bar?: string,
    }>(),
    mapWithAsyncProps(mapAsyncSpy, ['foo'])
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={2}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2 }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapAsyncSpy),
    [
      [{ foo: 2 }],
    ],
    'Mount: should call map function'
  )

  /* Update unwatched props */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={2}
        bar="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2 }], // Mount
      [{ foo: 2, bar: 'bar' }], // Update
    ],
    'Update unwatched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapAsyncSpy),
    [
      [{ foo: 2 }],
    ],
    'Update unwatched props: should not call map function'
  )

  /* Update watched props */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
        bar="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2 }], // Mount
      [{ foo: 2, bar: 'bar' }], // Update
      [{ foo: 4, bar: 'bar' }], // Update watched props
    ],
    'Update watched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapAsyncSpy),
    [
      [{ foo: 2 }],
      [{ foo: 4, bar: 'bar' }],
    ],
    'Update watched props: should call map function'
  )

  /* Resolve Promise */
  await act(async () => {
    await resolve()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2 }], // Mount
      [{ foo: 2, bar: 'bar' }], // Update
      [{ foo: 4, bar: 'bar' }], // Update watched props
    ],
    'Resolve Promise: should not rerender'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(mapAsyncSpy),
    [
      [{ foo: 2 }],
      [{ foo: 4, bar: 'bar' }],
    ],
    'Unount: should not call map function'
  )

  t.equals(
    getNumRenders(),
    3,
    'Render: should render component exact times'
  )
})

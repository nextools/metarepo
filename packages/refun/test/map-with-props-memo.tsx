import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, startWithType, mapWithPropsMemo } from '../src'

test('mapWithPropsMemo', (t) => {
  const mapSpy = createSpy(({ args }) => ({ bar: args[0].foo * 2 }))
  const componentSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{
      foo: number,
      watch?: string,
    }>(),
    mapWithPropsMemo(mapSpy, ['watch'])
  )(componentSpy)

  /* Mount */
  let testRenderer: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={2}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 2, bar: 4 }],
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [{ foo: 2 }],
    ],
    'Mount: should call map function'
  )

  /* Update unwatched props */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp foo={3}/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 2, bar: 4 }],
      [{ foo: 3, bar: 4 }],
    ],
    'Update unwatched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [{ foo: 2 }],
    ],
    'Update unwatched props: should not call map function'
  )

  /* Update watched props */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo={3}
        watch="watch"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 2, bar: 4 }],
      [{ foo: 3, bar: 4 }],
      [{ foo: 3, bar: 6, watch: 'watch' }],
    ],
    'Update watched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [{ foo: 2 }],
      [{ foo: 3, watch: 'watch' }],
    ],
    'Update watched props: should call map function'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [{ foo: 2 }],
      [{ foo: 3, watch: 'watch' }],
    ],
    'Unmount: should not call map function'
  )

  t.equals(
    getNumRenders(),
    3,
    'Render: should render component exact times'
  )

  t.end()
})

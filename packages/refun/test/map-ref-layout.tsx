import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, startWithType, mapRefLayout } from '../src'

test('mapRefLayout', (t) => {
  const refInstance = { value: 4 }
  const mapSpy = createSpy(({ args }) => ({ result: args[0] === null ? 0 : args[0].value * 2 }))
  const compSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(compSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{
      foo: number,
      watch?: string,
    }>(),
    mapRefLayout('valueRef', mapSpy, ['watch'])
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

  const { valueRef } = getProps(0)

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2, valueRef, result: 0 }],
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [null, { foo: 2 }],
    ],
    'Mount: should call map function'
  )

  /* Update unwatched value */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2, valueRef, result: 0 }],
      [{ foo: 4, valueRef, result: 0 }],
    ],
    'Update unwatched value: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [null, { foo: 2 }],
    ],
    'Update unwatched value: should not call map function'
  )

  /* Update watched value */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
        watch="watch"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2, valueRef, result: 0 }],
      [{ foo: 4, valueRef, result: 0 }],
      [{ foo: 4, watch: 'watch', valueRef, result: 0 }],
    ],
    'Update watched value: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [null, { foo: 2 }],
    ],
    'Update watched value: should not call map function'
  )

  /* Write to Ref */
  act(() => {
    valueRef.current = refInstance
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2, valueRef, result: 0 }],
      [{ foo: 4, valueRef, result: 0 }],
      [{ foo: 4, watch: 'watch', valueRef, result: 0 }],
    ],
    'Write to Ref: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [null, { foo: 2 }],
    ],
    'Write to Ref: should not call map function'
  )

  /* Update unwatched value */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={8}
        watch="watch"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2, valueRef, result: 0 }],
      [{ foo: 4, valueRef, result: 0 }],
      [{ foo: 4, watch: 'watch', valueRef, result: 0 }],
      [{ foo: 8, watch: 'watch', valueRef, result: 0 }],
    ],
    'Update unwatched value: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [null, { foo: 2 }],
    ],
    'Update unwatched value: should not call map function'
  )

  /* Update watched value */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={8}
        watch="foo"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 2, valueRef, result: 0 }],
      [{ foo: 4, valueRef, result: 0 }],
      [{ foo: 4, watch: 'watch', valueRef, result: 0 }],
      [{ foo: 8, watch: 'watch', valueRef, result: 0 }],
      [{ foo: 8, watch: 'foo', valueRef, result: 0 }],
      [{ foo: 8, watch: 'foo', valueRef, result: 8 }],
    ],
    'Update watched value: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [null, { foo: 2 }],
      [refInstance, { foo: 8, watch: 'foo' }],
    ],
    'Update watched value: should call map function'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(mapSpy),
    [
      [null, { foo: 2 }],
      [refInstance, { foo: 8, watch: 'foo' }],
    ],
    'Update watched value: should not call map function'
  )

  t.equals(
    getNumRenders(),
    6,
    'Render: should render component exact times'
  )

  t.end()
})

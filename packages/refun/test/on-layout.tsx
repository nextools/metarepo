import TestRenderer, { act } from 'react-test-renderer'
import type { ReactTestRenderer } from 'react-test-renderer'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { component, startWithType, onLayout } from '../src'

test('onLayout: empty watch keys', (t) => {
  const onUnsubSpy = createSpy(() => {})
  const onLayoutSpy = createSpy(() => onUnsubSpy)
  const componentSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: string }>(),
    onLayout(onLayoutSpy, [])
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
    getSpyCalls(onLayoutSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Mount: should call onLayout'
  )

  t.deepEquals(
    getSpyCalls(onUnsubSpy),
    [],
    'Mount: should call unsub'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp foo="bar"/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
      [{ foo: 'bar' }], // Update
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onLayoutSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Update: should not call onLayout if array was empty'
  )

  t.deepEquals(
    getSpyCalls(onUnsubSpy),
    [],
    'Update: should not call unsub'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onLayoutSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Unmount: should not call onLayout'
  )

  t.deepEquals(
    getSpyCalls(onUnsubSpy),
    [
      [],
    ],
    'Unmount: should call unsub'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

test('onLayout: watch keys', (t) => {
  const onUnsubSpy = createSpy(() => {})
  const onLayoutSpy = createSpy(() => onUnsubSpy)
  const componentSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: string, bar: string }>(),
    onLayout(onLayoutSpy, ['foo'])
  )(componentSpy)

  let testRenderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo="foo"
        bar="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', bar: 'bar' }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onLayoutSpy),
    [
      [{ foo: 'foo', bar: 'bar' }], // Mount
    ],
    'Mount: should call onLayout'
  )

  t.deepEquals(
    getSpyCalls(onUnsubSpy),
    [],
    'Mount: should not call unsub'
  )

  /* Update not watched prop */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo="foo"
        bar="baz"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', bar: 'bar' }], // Mount
      [{ foo: 'foo', bar: 'baz' }], // Update not watched prop
    ],
    'Update not watched prop: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onLayoutSpy),
    [
      [{ foo: 'foo', bar: 'bar' }], // Mount
    ],
    'Update not watched prop: should not call update if changed props were not watched'
  )

  t.deepEquals(
    getSpyCalls(onUnsubSpy),
    [],
    'Mount: should not call unsub'
  )

  /* Update watched prop */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo="bar"
        bar="baz"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', bar: 'bar' }], // Mount
      [{ foo: 'foo', bar: 'baz' }], // Update not watched prop
      [{ foo: 'bar', bar: 'baz' }], // Update watched prop
    ],
    'Update watched prop: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onLayoutSpy),
    [
      [{ foo: 'foo', bar: 'bar' }], // Mount
      [{ foo: 'bar', bar: 'baz' }], // Update watched prop
    ],
    'Update watched prop: should call update if changed props were watched'
  )

  t.deepEquals(
    getSpyCalls(onUnsubSpy),
    [
      [],
    ],
    'Update watched prop: should call unsub'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onLayoutSpy),
    [
      [{ foo: 'foo', bar: 'bar' }], // Mount
      [{ foo: 'bar', bar: 'baz' }], // Update watched prop
    ],
    'Unmount: should not call onLayout'
  )

  t.deepEquals(
    getSpyCalls(onUnsubSpy),
    [
      [],
      [],
    ],
    'Unmount: should call unsub'
  )

  t.equals(
    getNumRenders(),
    3,
    'Render: should render component exact times'
  )

  t.end()
})

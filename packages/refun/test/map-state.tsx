import TestRenderer, { act } from 'react-test-renderer'
import type { ReactTestRenderer } from 'react-test-renderer'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { component, mapState, startWithType } from '../src'

test('mapState', (t) => {
  const componentSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(componentSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const spy = createSpy(({ args }) => Math.round(args[0].foo / 2) * 2)
  const MyComp = component(
    startWithType<{
      foo: number,
      bar?: string,
    }>(),
    mapState('state', 'setState', spy, ['foo'])
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

  const { state, setState } = getProps(0)

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 2, state: 2, setState }], // Mount
    ],
    'Mount: should pass props, state and state-setter'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 2 }], // Mount
    ],
    'Mount: should call map function'
  )

  /* Update unwatched props */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo={2}
        bar="bar"
      />
    )
  })

  t.equals(
    getProps(1).state,
    state,
    'Update unwatched props: should pass same state instance'
  )

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 2, state: 2, setState }], // Mount
      [{ foo: 2, bar: 'bar', state, setState }], // Update unwatched props
    ],
    'Update unwatched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 2 }], // Mount
    ],
    'Update unwatched props: should not call map function'
  )

  /* Update watched props */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
        bar="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 2, state: 2, setState }], // Mount
      [{ foo: 2, bar: 'bar', state, setState }], // Update unwatched props
      [{ foo: 4, bar: 'bar', state: 4, setState }], // Update watched props
      [{ foo: 4, bar: 'bar', state: 4, setState }], // Update watched props
    ],
    'Update watched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 2 }], // Mount
      [{ foo: 4, bar: 'bar' }], // Update watched props
    ],
    'Update watched props: should call map function'
  )

  /* Update watched props, no rerender */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4.5}
        bar="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 2, state: 2, setState }], // Mount
      [{ foo: 2, bar: 'bar', state, setState }], // Update unwatched props
      [{ foo: 4, bar: 'bar', state: 4, setState }], // Update watched props
      [{ foo: 4, bar: 'bar', state: 4, setState }], // Update watched props
      [{ foo: 4.5, bar: 'bar', state: 4, setState }], // Update watched props, no rerender
    ],
    'Update watched props, no rerender: should pass props'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 2 }], // Mount
      [{ foo: 4, bar: 'bar' }], // Update watched props
      [{ foo: 4.5, bar: 'bar' }], // Update watched props, no rerender
    ],
    'Update watched props, no rerender: should call map function'
  )

  /* Update state */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    setState(10)
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 2, state: 2, setState }], // Mount
      [{ foo: 2, bar: 'bar', state, setState }], // Update unwatched props
      [{ foo: 4, bar: 'bar', state: 4, setState }], // Update watched props
      [{ foo: 4, bar: 'bar', state: 4, setState }], // Update watched props
      [{ foo: 4.5, bar: 'bar', state: 4, setState }], // Update watched props, no rerender
      [{ foo: 4.5, bar: 'bar', state: 10, setState }], // Update state
    ],
    'Update state: should update state, but leave state-setter same'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 2 }], // Mount
      [{ foo: 4, bar: 'bar' }], // Update watched props
      [{ foo: 4.5, bar: 'bar' }], // Update watched props, no rerender
    ],
    'Update state: should not call map function'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{ foo: 2 }], // Mount
      [{ foo: 4, bar: 'bar' }], // Update watched props
      [{ foo: 4.5, bar: 'bar' }], // Update watched props, no rerender
    ],
    'Unmount: should not call map function'
  )

  t.equals(
    getNumRenders(),
    6,
    'Render: should render component exact times'
  )

  t.end()
})

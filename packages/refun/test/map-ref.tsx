import TestRenderer, { act } from 'react-test-renderer'
import type { ReactTestRenderer } from 'react-test-renderer'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { component, startWithType, mapRef } from '../src'

test('mapRef', (t) => {
  const componentSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(componentSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{
      foo: number,
      bar?: string,
    }>(),
    mapRef('valueRef', 42)
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

  const { valueRef } = getProps(0)

  t.deepEquals(
    valueRef.current,
    42,
    'Mount: should pass ref'
  )

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 2, valueRef }],
    ],
    'Mount: should pass props'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 2, valueRef }],
      [{ foo: 4, valueRef }],
    ],
    'Update: should pass props'
  )

  /* Write to Ref */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    valueRef.current = 99
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 2, valueRef }],
      [{ foo: 4, valueRef }],
    ],
    'Write to Ref: should not rerender'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

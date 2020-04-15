import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, mapPressed, startWithType, TMapPressed } from '../src'

test('mapPressed: no props', (t) => {
  const componentSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(componentSpy)[getSpyCalls(componentSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapPressed>(),
    mapPressed
  )(componentSpy)

  /* Mount */
  let testRenderer: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={4}
      />
    )
  })

  const { onPressIn, onPressOut } = getProps()

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
    ],
    'Mount: should pass props'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo={8}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
    ],
    'Update: should pass props'
  )

  /* Call onPressIn */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
    ],
    'Call onPressIn: should pass props'
  )

  /* Call onPressIn again */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn again
    ],
    'Call onPressIn again: should rerender'
  )

  /* Call onPressOut */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn again
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Call onPressOut
    ],
    'Call onPressOut: should pass props'
  )

  /* Call onPressOut again */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn again
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Call onPressOut
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Call onPressOut again
    ],
    'Call onPressOut again: should rerender'
  )

  t.equals(
    getNumRenders(),
    6,
    'Render: should render component exact times'
  )

  t.end()
})

test('mapPressed: external handlers', (t) => {
  const onPressInSpy = createSpy(() => {})
  const onPressOutSpy = createSpy(() => {})
  const componentSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(componentSpy)[getSpyCalls(componentSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapPressed>(),
    mapPressed
  )(componentSpy)

  /* Mount */
  let testRenderer: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={4}
        onPressIn={onPressInSpy}
        onPressOut={onPressOutSpy}
      />
    )
  })

  const { onPressIn, onPressOut } = getProps()

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [],
    'Mount: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [],
    'Mount: should not call onPressOut'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo={8}
        onPressIn={onPressInSpy}
        onPressOut={onPressOutSpy}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [],
    'Update: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [],
    'Update: should not call onPressOut'
  )

  /* Call onPressIn */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
    ],
    'Call onPressIn: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Call onPressIn: should call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [],
    'Call onPressIn: should not call onPressOut'
  )

  /* Call onPressIn again */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn again
    ],
    'Call onPressIn again: should rerender'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
      [],
    ],
    'Call onPressIn again: should call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [],
    'Call onPressIn again: should not call onPressOut'
  )

  /* Call onPressOut */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn again
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Call onPressOut
    ],
    'Call onPressOut: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
      [],
    ],
    'Call onPressOut: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
    ],
    'Call onPressOut: should call onPressOut'
  )

  /* Call onPressOut again */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn again
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Call onPressOut
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Call onPressOut again
    ],
    'Call onPressOut again: should rerender'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
      [],
    ],
    'Call onPressOut again: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
      [],
    ],
    'Call onPressOut again: should call onPressOut'
  )

  /* Replace handlers */
  const onPressInSpy1 = createSpy(() => {})
  const onPressOutSpy1 = createSpy(() => {})

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo={8}
        onPressIn={onPressInSpy1}
        onPressOut={onPressOutSpy1}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn again
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Call onPressOut
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Call onPressOut again
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Replace handlers
    ],
    'Replace handlers: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy1),
    [],
    'Replace handlers: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy1),
    [],
    'Replace handlers: should not call onPressOut'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
      [],
    ],
    'Replace handlers: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
      [],
    ],
    'Replace handlers: should not call onPressOut'
  )

  /* Call onPressIn */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(onPressInSpy1),
    [
      [],
    ],
    'Call onPressIn: should call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy1),
    [],
    'Call onPressIn: should not call onPressOut'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
      [],
    ],
    'Call onPressIn: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
      [],
    ],
    'Call onPressIn: should not call prev onPressOut'
  )

  /* Call onPressOut */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(onPressInSpy1),
    [
      [],
    ],
    'Call onPressOut: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy1),
    [
      [],
    ],
    'Call onPressOut: should call onPressOut'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
      [],
    ],
    'Call onPressOut: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
      [],
    ],
    'Call onPressOut: should not call prev onPressOut'
  )

  /* Remove handlers */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo={8}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn again
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Call onPressOut
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Call onPressOut again
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Replace handlers
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Call onPressOut
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Remove handlers
    ],
    'Remove handlers: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy1),
    [
      [],
    ],
    'Remove handlers: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy1),
    [
      [],
    ],
    'Remove handlers: should not call onPressOut'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
      [],
    ],
    'Remove handlers: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
      [],
    ],
    'Repmove handlers: should not call onPressOut'
  )

  /* Call onPressIn */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(onPressInSpy1),
    [
      [],
    ],
    'Call onPressIn: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy1),
    [
      [],
    ],
    'Call onPressIn: should not call onPressOut'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
      [],
    ],
    'Call onPressIn: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
      [],
    ],
    'Call onPressIn: should not call prev onPressOut'
  )

  /* Call onPressOut */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(onPressInSpy1),
    [
      [],
    ],
    'Call onPressOut: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy1),
    [
      [],
    ],
    'Call onPressOut: should not call onPressOut'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
      [],
    ],
    'Call onPressOut: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
      [],
    ],
    'Call onPressOut: should not call prev onPressOut'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onPressInSpy1),
    [
      [],
    ],
    'Unmount: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy1),
    [
      [],
    ],
    'Unmount: should not call onPressOut'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
      [],
    ],
    'Unmount: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
      [],
    ],
    'Unmount: should not call onPressOut'
  )

  t.equals(
    getNumRenders(),
    12,
    'Render: should render component exact times'
  )

  t.end()
})

test('mapPressed: external isPressed', (t) => {
  const componentSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(componentSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapPressed>(),
    mapPressed
  )(componentSpy)

  /* Mount */
  let testRenderer: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={4}
      />
    )
  })

  const { onPressIn, onPressOut } = getProps(0)

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
    ],
    'Mount: should pass props'
  )

  /* Provide exteranal value */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
        isPressed
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 4, isPressed: true, onPressIn, onPressOut }], // Update
    ],
    'Update: should pass props'
  )

  /* Call onPressIn */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 4, isPressed: true, onPressIn, onPressOut }], // Update
      [{ foo: 4, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
    ],
    'Call onPressIn: should pass props'
  )

  /* Call onPressOut */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 4, isPressed: true, onPressIn, onPressOut }], // Update
      [{ foo: 4, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
      [{ foo: 4, isPressed: true, onPressIn, onPressOut }], // Call onPressOut
    ],
    'Call onPressOut: should pass props'
  )

  t.equals(
    getNumRenders(),
    4,
    'Render: should render component exact times'
  )

  t.end()
})

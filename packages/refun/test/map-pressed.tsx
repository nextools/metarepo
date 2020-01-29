import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, mapPressed, startWithType, TMapPressed } from '../src'

test('mapPressed: no props', (t) => {
  const compSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(compSpy)[getSpyCalls(compSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapPressed>(),
    mapPressed
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={4}
      />
    )
  })

  const { onPressIn, onPressOut } = getProps()

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
    ],
    'Mount: should pass props'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={8}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
    ],
    'Update: should pass props'
  )

  /* Call onPressIn */
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
    ],
    'Call onPressIn: should pass props'
  )

  /* Call onPressIn again */
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isPressed: false, onPressIn, onPressOut }], // Update
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
      [{ foo: 8, isPressed: true, onPressIn, onPressOut }], // Call onPressIn again
    ],
    'Call onPressIn again: should rerender'
  )

  /* Call onPressOut */
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
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
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
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
  const compSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(compSpy)[getSpyCalls(compSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapPressed>(),
    mapPressed
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

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
    getSpyCalls(compSpy),
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
    getSpyCalls(compSpy),
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
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
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
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
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
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
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
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
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
    getSpyCalls(compSpy),
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
  act(() => {
    testRenderer.update(
      <MyComp
        foo={8}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
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
  const compSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(compSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapPressed>(),
    mapPressed
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={4}
      />
    )
  })

  const { onPressIn, onPressOut } = getProps(0)

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
    ],
    'Mount: should pass props'
  )

  /* Provide exteranal value */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
        isPressed
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 4, isPressed: true, onPressIn, onPressOut }], // Update
    ],
    'Update: should pass props'
  )

  /* Call onPressIn */
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isPressed: false, onPressIn, onPressOut }], // Mount
      [{ foo: 4, isPressed: true, onPressIn, onPressOut }], // Update
      [{ foo: 4, isPressed: true, onPressIn, onPressOut }], // Call onPressIn
    ],
    'Call onPressIn: should pass props'
  )

  /* Call onPressOut */
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
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

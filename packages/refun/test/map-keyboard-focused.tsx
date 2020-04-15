import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, mapKeyboardFocused, startWithType, TMapKeyboardFocused } from '../src'

test('mapKeyboardFocused: no props, focus by press in', (t) => {
  const componentSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(componentSpy)[getSpyCalls(componentSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapKeyboardFocused>(),
    mapKeyboardFocused
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

  const { onFocus, onBlur, onPressIn, onPressOut } = getProps()

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
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
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
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
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
    ],
    'Call onPressIn: should not rerender'
  )

  /* Call onFocus */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onFocus()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
    ],
    'Call onFocus: should not rerender'
  )

  /* Call onPressOut */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
    ],
    'Call onPressOut: should not rerender'
  )

  /* Call onBlur */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onBlur()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
    ],
    'Call onBlur: should not rerender'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

test('mapKeyboardFocused: no props, focus by keyboard', (t) => {
  const componentSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(componentSpy)[getSpyCalls(componentSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapKeyboardFocused>(),
    mapKeyboardFocused
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

  const { onFocus, onBlur, onPressIn, onPressOut } = getProps()

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
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
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
    ],
    'Update: should pass props'
  )

  /* Call onFocus */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onFocus()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: true, onFocus, onBlur, onPressIn, onPressOut }], // Call onFocus
    ],
    'Call onFocus: should not rerender'
  )

  /* Call onPressIn */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: true, onFocus, onBlur, onPressIn, onPressOut }], // Call onFocus
    ],
    'Call onPressIn: should not rerender'
  )

  /* Call onBlur */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onBlur()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: true, onFocus, onBlur, onPressIn, onPressOut }], // Call onFocus
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Call onBlur
    ],
    'Call onBlur: should not rerender'
  )

  /* Call onPressOut */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: true, onFocus, onBlur, onPressIn, onPressOut }], // Call onFocus
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Call onBlur
    ],
    'Call onPressOut: should not rerender'
  )

  t.equals(
    getNumRenders(),
    4,
    'Render: should render component exact times'
  )

  t.end()
})

test('mapKeyboardFocused: external handlers', (t) => {
  const onFocusSpy = createSpy(() => {})
  const onBlurSpy = createSpy(() => {})
  const onPressInSpy = createSpy(() => {})
  const onPressOutSpy = createSpy(() => {})
  const componentSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(componentSpy)[getSpyCalls(componentSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapKeyboardFocused>(),
    mapKeyboardFocused
  )(componentSpy)

  /* Mount */
  let testRenderer: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={4}
        onFocus={onFocusSpy}
        onBlur={onBlurSpy}
        onPressIn={onPressInSpy}
        onPressOut={onPressOutSpy}
      />
    )
  })

  const { onFocus, onBlur, onPressIn, onPressOut } = getProps()

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy),
    [],
    'Mount: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [],
    'Mount: should not call onBlur'
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
        onFocus={onFocusSpy}
        onBlur={onBlurSpy}
        onPressIn={onPressInSpy}
        onPressOut={onPressOutSpy}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy),
    [],
    'Update: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [],
    'Update: should not call onBlur'
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
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
    ],
    'Call onPressIn: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy),
    [],
    'Call onPressIn: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [],
    'Call onPressIn: should not call onBlur'
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

  /* Call onFocus */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onFocus()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
    ],
    'Call onFocus: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Call onFocus: should call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [],
    'Call onFocus: should not call onBlur'
  )
  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Call onFocus: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [],
    'Call onFocus: should not call onPressOut'
  )

  /* Call onPressOut */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
    ],
    'Call onPressOut: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Call onPressOut: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [],
    'Call onPressOut: should not call onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
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

  /* Call onBlur */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onBlur()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
    ],
    'Call onBlur: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Call onBlur: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
    ],
    'Call onBlur: should call onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Call onBlur: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
    ],
    'Call onBlur: should not call onPressOut'
  )

  /* Replace handlers */
  const onFocusSpy1 = createSpy(() => {})
  const onBlurSpy1 = createSpy(() => {})
  const onPressInSpy1 = createSpy(() => {})
  const onPressOutSpy1 = createSpy(() => {})

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo={8}
        onFocus={onFocusSpy1}
        onBlur={onBlurSpy1}
        onPressIn={onPressInSpy1}
        onPressOut={onPressOutSpy1}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Replace handlers
    ],
    'Replace handlers: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy1),
    [],
    'Replace handlers: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy1),
    [],
    'Replace handlers: should not call onBlur'
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
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Replace handlers: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
    ],
    'Replace handlers: should not call prev onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Replace handlers: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
    ],
    'Replace handlers: should not call prev onPressOut'
  )

  /* Call onPressIn */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Replace handlers
    ],
    'Call onPressIn: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy1),
    [],
    'Call onPressIn: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy1),
    [],
    'Call onPressIn: should not call onBlur'
  )

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
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Call onPressIn: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
    ],
    'Call onPressIn: should not call prev onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Call onPressIn: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
    ],
    'Call onPressIn: should not call prev onPressOut'
  )

  /* Call onFocus */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onFocus()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Replace handlers
    ],
    'Call onPressIn: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy1),
    [
      [],
    ],
    'Call onFocus: should call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy1),
    [],
    'Call onFocus: should not call onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy1),
    [
      [],
    ],
    'Call onFocus: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy1),
    [],
    'Call onFocus: should not call onPressOut'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Call onFocus: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
    ],
    'Call onFocus: should not call prev onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Call onFocus: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
    ],
    'Call onFocus: should not call prev onPressOut'
  )

  /* Call onPressOut */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Replace handlers
    ],
    'Call onPressOut: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy1),
    [
      [],
    ],
    'Call onPressOut: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy1),
    [],
    'Call onPressOut: should not call onBlur'
  )

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
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Call onPressOut: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
    ],
    'Call onPressOut: should not call prev onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Call onPressOut: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
    ],
    'Call onPressOut: should not call prev onPressOut'
  )

  /* Call onBlur */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onBlur()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Replace handlers
    ],
    'Call onBlur: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy1),
    [
      [],
    ],
    'Call onBlur: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy1),
    [
      [],
    ],
    'Call onBlur: should call onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy1),
    [
      [],
    ],
    'Call onBlur: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy1),
    [
      [],
    ],
    'Call onBlur: should not call onPressOut'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Call onBlur: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
    ],
    'Call onBlur: should not call prev onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Call onBlur: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
    ],
    'Call onBlur: should not call prev onPressOut'
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
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Replace handlers
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Remove handlers
    ],
    'Remove handlers: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy1),
    [
      [],
    ],
    'Remove handlers: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy1),
    [
      [],
    ],
    'Remove handlers: should not call onBlur'
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
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Remove handlers: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
    ],
    'Remove handlers: should not call prev onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Remove handlers: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
    ],
    'Remove handlers: should not call prev onPressOut'
  )

  /* Call onPressIn */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressIn()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Replace handlers
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Remove handlers
    ],
    'Call onPressIn: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy1),
    [
      [],
    ],
    'Call onPressIn: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy1),
    [
      [],
    ],
    'Call onPressIn: should not call onBlur'
  )

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
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Call onPressIn: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
    ],
    'Call onPressIn: should not call prev onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Call onPressIn: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
    ],
    'Call onPressIn: should not call prev onPressOut'
  )

  /* Call onFocus */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onFocus()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Replace handlers
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Remove handlers
    ],
    'Call onFocus: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy1),
    [
      [],
    ],
    'Call onFocus: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy1),
    [
      [],
    ],
    'Call onFocus: should not call onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy1),
    [
      [],
    ],
    'Call onFocus: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy1),
    [
      [],
    ],
    'Call onFocus: should not call onPressOut'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Call onFocus: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
    ],
    'Call onFocus: should not call prev onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Call onFocus: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
    ],
    'Call onFocus: should not call prev onPressOut'
  )

  /* Call onPressOut */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPressOut()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Replace handlers
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Remove handlers
    ],
    'Call onPressOut: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy1),
    [
      [],
    ],
    'Call onPressOut: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy1),
    [
      [],
    ],
    'Call onPressOut: should not call onBlur'
  )

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
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Call onPressOut: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
    ],
    'Call onPressOut: should not call prev onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Call onPressOut: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
    ],
    'Call onPressOut: should not call prev onPressOut'
  )

  /* Call onBlur */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onBlur()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Replace handlers
      [{ foo: 8, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Remove handlers
    ],
    'Call onBlur: should not rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy1),
    [
      [],
    ],
    'Call onBlur: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy1),
    [
      [],
    ],
    'Call onBlur: should not call onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy1),
    [
      [],
    ],
    'Call onBlur: should not call onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy1),
    [
      [],
    ],
    'Call onBlur: should not call onPressOut'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Call onBlur: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
    ],
    'Call onBlur: should not call prev onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Call onBlur: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
    ],
    'Call onBlur: should not call prev onPressOut'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onFocusSpy1),
    [
      [],
    ],
    'Unmount: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy1),
    [
      [],
    ],
    'Unmount: should not call onBlur'
  )

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
    getSpyCalls(onFocusSpy),
    [
      [],
    ],
    'Unmount: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
    ],
    'Unmount: should not call prev onBlur'
  )

  t.deepEquals(
    getSpyCalls(onPressInSpy),
    [
      [],
    ],
    'Unmount: should not call prev onPressIn'
  )

  t.deepEquals(
    getSpyCalls(onPressOutSpy),
    [
      [],
    ],
    'Unmount: should not call prev onPressOut'
  )

  t.equals(
    getNumRenders(),
    4,
    'Render: should render component exact times'
  )

  t.end()
})

test('mapKeyboardFocused: external isKeyboardFocused', (t) => {
  const componentSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(componentSpy)[getSpyCalls(componentSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapKeyboardFocused>(),
    mapKeyboardFocused
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

  const { onFocus, onBlur, onPressIn, onPressOut } = getProps()

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
    ],
    'Mount: should pass props'
  )

  /* Provide external value */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
        isKeyboardFocused
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 4, isKeyboardFocused: true, onFocus, onBlur, onPressIn, onPressOut }], // Update
    ],
    'Update: should pass props'
  )

  /* Call onFocus */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onFocus()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 4, isKeyboardFocused: true, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 4, isKeyboardFocused: true, onFocus, onBlur, onPressIn, onPressOut }], // Call onFocus
    ],
    'Call onFocus: should pass props'
  )

  /* Call onBlur */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onBlur()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isKeyboardFocused: false, onFocus, onBlur, onPressIn, onPressOut }], // Mount
      [{ foo: 4, isKeyboardFocused: true, onFocus, onBlur, onPressIn, onPressOut }], // Update
      [{ foo: 4, isKeyboardFocused: true, onFocus, onBlur, onPressIn, onPressOut }], // Call onFocus
      [{ foo: 4, isKeyboardFocused: true, onFocus, onBlur, onPressIn, onPressOut }], // Call onBlur
    ],
    'Call onBlur: should pass props'
  )

  t.equals(
    getNumRenders(),
    4,
    'Render: should render component exact times'
  )

  t.end()
})

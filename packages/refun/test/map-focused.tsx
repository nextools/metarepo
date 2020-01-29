import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, mapFocused, startWithType, TMapFocused } from '../src'

test('mapFocused: no props', (t) => {
  const compSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(compSpy)[getSpyCalls(compSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapFocused>(),
    mapFocused
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

  const { onFocus, onBlur } = getProps()

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
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
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Update
    ],
    'Update: should pass props'
  )

  /* Call onFocus */
  act(() => {
    onFocus()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Update
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus
    ],
    'Call onFocus: should pass props'
  )

  /* Call onFocus again */
  act(() => {
    onFocus()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Update
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus again
    ],
    'Call onFocus again: should rerender'
  )

  /* Call onBlur */
  act(() => {
    onBlur()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Update
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus again
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Call onBlur
    ],
    'Call onBlur: should pass props'
  )

  /* Call onBlur again */
  act(() => {
    onBlur()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Update
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus again
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Call onBlur
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Call onBlur again
    ],
    'Call onBlur again: should rerender'
  )

  t.equals(
    getNumRenders(),
    6,
    'Render: should render component exact times'
  )

  t.end()
})

test('mapFocused: external handlers', (t) => {
  const onFocusSpy = createSpy(() => {})
  const onBlurSpy = createSpy(() => {})
  const compSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(compSpy)[getSpyCalls(compSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapFocused>(),
    mapFocused
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={4}
        onFocus={onFocusSpy}
        onBlur={onBlurSpy}
      />
    )
  })

  const { onFocus, onBlur } = getProps()

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
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

  /* Update */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={8}
        onFocus={onFocusSpy}
        onBlur={onBlurSpy}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Update
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

  /* Call onFocus */
  act(() => {
    onFocus()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Update
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus
    ],
    'Call onFocus: should pass props'
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

  /* Call onFocus again */
  act(() => {
    onFocus()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Update
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus again
    ],
    'Call onFocus again: should rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy),
    [
      [],
      [],
    ],
    'Call onFocus again: should call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [],
    'Call onFocus again: should not call onBlur'
  )

  /* Call onBlur */
  act(() => {
    onBlur()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Update
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus again
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Call onBlur
    ],
    'Call onBlur: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy),
    [
      [],
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

  /* Call onBlur again */
  act(() => {
    onBlur()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Update
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus again
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Call onBlur
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Call onBlur again
    ],
    'Call onBlur again: should rerender'
  )

  t.deepEquals(
    getSpyCalls(onFocusSpy),
    [
      [],
      [],
    ],
    'Call onBlur again: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
      [],
    ],
    'Call onBlur again: should call onBlur'
  )

  /* Replace handlers */
  const onFocusSpy1 = createSpy(() => {})
  const onBlurSpy1 = createSpy(() => {})

  act(() => {
    testRenderer.update(
      <MyComp
        foo={8}
        onFocus={onFocusSpy1}
        onBlur={onBlurSpy1}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Update
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus again
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Call onBlur
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Call onBlur again
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Replace handlers
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
    getSpyCalls(onFocusSpy),
    [
      [],
      [],
    ],
    'Replace handlers: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
      [],
    ],
    'Replace handlers: should not call onBlur'
  )

  /* Call onFocus */
  act(() => {
    onFocus()
  })

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
    getSpyCalls(onFocusSpy),
    [
      [],
      [],
    ],
    'Call onFocus: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
      [],
    ],
    'Call onFocus: should not call prev onBlur'
  )

  /* Call onBlur */
  act(() => {
    onBlur()
  })

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
    getSpyCalls(onFocusSpy),
    [
      [],
      [],
    ],
    'Call onBlur: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
      [],
    ],
    'Call onBlur: should not call prev onBlur'
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
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Update
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus again
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Call onBlur
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Call onBlur again
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Replace handlers
      [{ foo: 8, isFocused: true, onFocus, onBlur }], // Call onFocus
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Call onBlur
      [{ foo: 8, isFocused: false, onFocus, onBlur }], // Remove handlers
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
    getSpyCalls(onFocusSpy),
    [
      [],
      [],
    ],
    'Remove handlers: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
      [],
    ],
    'Repmove handlers: should not call onBlur'
  )

  /* Call onFocus */
  act(() => {
    onFocus()
  })

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
    getSpyCalls(onFocusSpy),
    [
      [],
      [],
    ],
    'Call onFocus: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
      [],
    ],
    'Call onFocus: should not call prev onBlur'
  )

  /* Call onBlur */
  act(() => {
    onBlur()
  })

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
    getSpyCalls(onFocusSpy),
    [
      [],
      [],
    ],
    'Call onBlur: should not call prev onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
      [],
    ],
    'Call onBlur: should not call prev onBlur'
  )

  /* Unmount */
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
    getSpyCalls(onFocusSpy),
    [
      [],
      [],
    ],
    'Unmount: should not call onFocus'
  )

  t.deepEquals(
    getSpyCalls(onBlurSpy),
    [
      [],
      [],
    ],
    'Unmount: should not call onBlur'
  )

  t.equals(
    getNumRenders(),
    12,
    'Render: should render component exact times'
  )

  t.end()
})

test('mapFocused: external isFocused', (t) => {
  const compSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(compSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapFocused>(),
    mapFocused
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

  const { onFocus, onBlur } = getProps(0)

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
    ],
    'Mount: should pass props'
  )

  /* Provide external value */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
        isFocused
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 4, isFocused: true, onFocus, onBlur }], // Update
    ],
    'Update: should pass props'
  )

  /* Call onFocus */
  act(() => {
    onFocus()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 4, isFocused: true, onFocus, onBlur }], // Update
      [{ foo: 4, isFocused: true, onFocus, onBlur }], // Call onFocus
    ],
    'Call onFocus: should pass props'
  )

  /* Call onBlur */
  act(() => {
    onBlur()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isFocused: false, onFocus, onBlur }], // Mount
      [{ foo: 4, isFocused: true, onFocus, onBlur }], // Update
      [{ foo: 4, isFocused: true, onFocus, onBlur }], // Call onFocus
      [{ foo: 4, isFocused: true, onFocus, onBlur }], // Call onBlur
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

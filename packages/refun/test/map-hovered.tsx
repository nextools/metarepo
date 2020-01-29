import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, mapHovered, startWithType, TMapHovered } from '../src'

test('mapHovered: no props', (t) => {
  const compSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(compSpy)[getSpyCalls(compSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapHovered>(),
    mapHovered
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

  const { onPointerEnter, onPointerLeave } = getProps()

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
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
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
    ],
    'Update: should pass props'
  )

  /* Call onPointerEnter */
  act(() => {
    onPointerEnter()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
    ],
    'Call onPointerEnter: should pass props'
  )

  /* Call onPointerEnter again */
  act(() => {
    onPointerEnter()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter again
    ],
    'Call onPointerEnter again: should rerender'
  )

  /* Call onPointerLeave */
  act(() => {
    onPointerLeave()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter again
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Call onPointerLeave
    ],
    'Call onPointerLeave: should pass props'
  )

  /* Call onPointerLeave again */
  act(() => {
    onPointerLeave()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter again
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Call onPointerLeave
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Call onPointerLeave again
    ],
    'Call onPointerLeave again: should rerender'
  )

  t.equals(
    getNumRenders(),
    6,
    'Render: should render component exact times'
  )

  t.end()
})

test('mapHovered: external handlers', (t) => {
  const onPointerEnterSpy = createSpy(() => {})
  const onPointerLeaveSpy = createSpy(() => {})
  const compSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(compSpy)[getSpyCalls(compSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapHovered>(),
    mapHovered
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={4}
        onPointerEnter={onPointerEnterSpy}
        onPointerLeave={onPointerLeaveSpy}
      />
    )
  })

  const { onPointerEnter, onPointerLeave } = getProps()

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy),
    [],
    'Mount: should not call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy),
    [],
    'Mount: should not call onPointerLeave'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={8}
        onPointerEnter={onPointerEnterSpy}
        onPointerLeave={onPointerLeaveSpy}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy),
    [],
    'Update: should not call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy),
    [],
    'Update: should not call onPointerLeave'
  )

  /* Call onPointerEnter */
  act(() => {
    onPointerEnter()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
    ],
    'Call onPointerEnter: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy),
    [
      [],
    ],
    'Call onPointerEnter: should call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy),
    [],
    'Call onPointerEnter: should not call onPointerLeave'
  )

  /* Call onPointerEnter again */
  act(() => {
    onPointerEnter()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter again
    ],
    'Call onPointerEnter again: should rerender'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy),
    [
      [],
      [],
    ],
    'Call onPointerEnter again: should call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy),
    [],
    'Call onPointerEnter again: should not call onPointerLeave'
  )

  /* Call onPointerLeave */
  act(() => {
    onPointerLeave()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter again
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Call onPointerLeave
    ],
    'Call onPointerLeave: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy),
    [
      [],
      [],
    ],
    'Call onPointerLeave: should not call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy),
    [
      [],
    ],
    'Call onPointerLeave: should call onPointerLeave'
  )

  /* Call onPointerLeave again */
  act(() => {
    onPointerLeave()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter again
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Call onPointerLeave
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Call onPointerLeave again
    ],
    'Call onPointerLeave again: should rerender'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy),
    [
      [],
      [],
    ],
    'Call onPointerLeave again: should not call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy),
    [
      [],
      [],
    ],
    'Call onPointerLeave again: should call onPointerLeave'
  )

  /* Replace handlers */
  const onPointerEnterSpy1 = createSpy(() => {})
  const onPointerLeaveSpy1 = createSpy(() => {})

  act(() => {
    testRenderer.update(
      <MyComp
        foo={8}
        onPointerEnter={onPointerEnterSpy1}
        onPointerLeave={onPointerLeaveSpy1}
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter again
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Call onPointerLeave
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Call onPointerLeave again
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Replace handlers
    ],
    'Replace handlers: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy1),
    [],
    'Replace handlers: should not call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy1),
    [],
    'Replace handlers: should not call onPointerLeave'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy),
    [
      [],
      [],
    ],
    'Replace handlers: should not call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy),
    [
      [],
      [],
    ],
    'Replace handlers: should not call onPointerLeave'
  )

  /* Call onPointerEnter */
  act(() => {
    onPointerEnter()
  })

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy1),
    [
      [],
    ],
    'Call onPointerEnter: should call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy1),
    [],
    'Call onPointerEnter: should not call onPointerLeave'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy),
    [
      [],
      [],
    ],
    'Call onPointerEnter: should not call prev onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy),
    [
      [],
      [],
    ],
    'Call onPointerEnter: should not call prev onPointerLeave'
  )

  /* Call onPointerLeave */
  act(() => {
    onPointerLeave()
  })

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy1),
    [
      [],
    ],
    'Call onPointerLeave: should not call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy1),
    [
      [],
    ],
    'Call onPointerLeave: should call onPointerLeave'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy),
    [
      [],
      [],
    ],
    'Call onPointerLeave: should not call prev onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy),
    [
      [],
      [],
    ],
    'Call onPointerLeave: should not call prev onPointerLeave'
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
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter again
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Call onPointerLeave
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Call onPointerLeave again
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Replace handlers
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Call onPointerLeave
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Remove handlers
    ],
    'Remove handlers: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy1),
    [
      [],
    ],
    'Remove handlers: should not call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy1),
    [
      [],
    ],
    'Remove handlers: should not call onPointerLeave'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy),
    [
      [],
      [],
    ],
    'Remove handlers: should not call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy),
    [
      [],
      [],
    ],
    'Repmove handlers: should not call onPointerLeave'
  )

  /* Call onPointerEnter */
  act(() => {
    onPointerEnter()
  })

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy1),
    [
      [],
    ],
    'Call onPointerEnter: should not call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy1),
    [
      [],
    ],
    'Call onPointerEnter: should not call onPointerLeave'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy),
    [
      [],
      [],
    ],
    'Call onPointerEnter: should not call prev onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy),
    [
      [],
      [],
    ],
    'Call onPointerEnter: should not call prev onPointerLeave'
  )

  /* Call onPointerLeave */
  act(() => {
    onPointerLeave()
  })

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy1),
    [
      [],
    ],
    'Call onPointerLeave: should not call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy1),
    [
      [],
    ],
    'Call onPointerLeave: should not call onPointerLeave'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy),
    [
      [],
      [],
    ],
    'Call onPointerLeave: should not call prev onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy),
    [
      [],
      [],
    ],
    'Call onPointerLeave: should not call prev onPointerLeave'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy1),
    [
      [],
    ],
    'Unmount: should not call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy1),
    [
      [],
    ],
    'Unmount: should not call onPointerLeave'
  )

  t.deepEquals(
    getSpyCalls(onPointerEnterSpy),
    [
      [],
      [],
    ],
    'Unmount: should not call onPointerEnter'
  )

  t.deepEquals(
    getSpyCalls(onPointerLeaveSpy),
    [
      [],
      [],
    ],
    'Unmount: should not call onPointerLeave'
  )

  t.equals(
    getNumRenders(),
    12,
    'Render: should render component exact times'
  )

  t.end()
})

test('mapHovered: external isHovered', (t) => {
  const compSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(compSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapHovered>(),
    mapHovered
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

  const { onPointerEnter, onPointerLeave } = getProps(0)

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
    ],
    'Mount: should pass props'
  )

  /* Provide exteranal value */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
        isHovered
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 4, isHovered: true, onPointerEnter, onPointerLeave }], // Update
    ],
    'Update: should pass props'
  )

  /* Call onPointerEnter */
  act(() => {
    onPointerEnter()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 4, isHovered: true, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 4, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
    ],
    'Call onPointerEnter: should pass props'
  )

  /* Call onPointerLeave */
  act(() => {
    onPointerLeave()
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 4, isHovered: true, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 4, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
      [{ foo: 4, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerLeave
    ],
    'Call onPointerLeave: should pass props'
  )

  t.equals(
    getNumRenders(),
    4,
    'Render: should render component exact times'
  )

  t.end()
})

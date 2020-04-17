import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, mapHovered, startWithType, TMapHovered } from '../src'

test('mapHovered: no props', (t) => {
  const componentSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(componentSpy)[getSpyCalls(componentSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapHovered>(),
    mapHovered
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

  const { onPointerEnter, onPointerLeave } = getProps()

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
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
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
    ],
    'Update: should pass props'
  )

  /* Call onPointerEnter */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPointerEnter()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
    ],
    'Call onPointerEnter: should pass props'
  )

  /* Call onPointerEnter again */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPointerEnter()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 8, isHovered: false, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
      [{ foo: 8, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter again
    ],
    'Call onPointerEnter again: should rerender'
  )

  /* Call onPointerLeave */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPointerLeave()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPointerLeave()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
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
  const componentSpy = createSpy(() => null)
  const getProps = () => getSpyCalls(componentSpy)[getSpyCalls(componentSpy).length - 1][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapHovered>(),
    mapHovered
  )(componentSpy)

  /* Mount */
  let testRenderer: ReactTestRenderer

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
    getSpyCalls(componentSpy),
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
    getSpyCalls(componentSpy),
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPointerEnter()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPointerEnter()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPointerLeave()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPointerLeave()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
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

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
    getSpyCalls(componentSpy),
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
  const componentSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(componentSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: number } & TMapHovered>(),
    mapHovered
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

  const { onPointerEnter, onPointerLeave } = getProps(0)

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
    ],
    'Mount: should pass props'
  )

  /* Provide exteranal value */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
        isHovered
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 4, isHovered: true, onPointerEnter, onPointerLeave }], // Update
    ],
    'Update: should pass props'
  )

  /* Call onPointerEnter */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPointerEnter()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 4, isHovered: false, onPointerEnter, onPointerLeave }], // Mount
      [{ foo: 4, isHovered: true, onPointerEnter, onPointerLeave }], // Update
      [{ foo: 4, isHovered: true, onPointerEnter, onPointerLeave }], // Call onPointerEnter
    ],
    'Call onPointerEnter: should pass props'
  )

  /* Call onPointerLeave */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    onPointerLeave()
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
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

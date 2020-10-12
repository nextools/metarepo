import React from 'react'
import { create, act } from 'react-test-renderer'
import type { ReactTestRenderer } from 'react-test-renderer'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { PrimitiveSize } from '../src/PrimitiveSize'

test('revert/PrimitiveSize: standard flow', (t) => {
  const sizes = [{
    width: 42.424,
    height: 34.343,
  }, {
    width: 42.424,
    height: 34.343,
  }]
  const onWidthChangeSpy = createSpy(() => {})
  const onHeightChangeSpy = createSpy(() => {})
  const getRectSpy = createSpy(({ index }) => sizes[index])
  const getWidthSpy = createSpy(({ index }) => sizes[index].width)
  const getHeightSpy = createSpy(({ index }) => sizes[index].height)

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <PrimitiveSize
        width={0}
        height={0}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </PrimitiveSize>
      , {
        createNodeMock: () => {
          return {
            firstElementChild: {
              getBoundingClientRect: getRectSpy,
            },
            get offsetWidth() {
              return getWidthSpy()
            },
            get offsetHeight() {
              return getHeightSpy()
            },
          }
        },
      }
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [
      [42.424],
    ],
    'Mount: should call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [34.343],
    ],
    'Mount: should call onHeightChange'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.update(
      <PrimitiveSize
        width={42.424}
        height={34.343}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </PrimitiveSize>
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [
      [42.424],
    ],
    'Update: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [34.343],
    ],
    'Update: should not call onHeightChange'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [
      [42.424],
    ],
    'Unmount: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [34.343],
    ],
    'Unmount: should not call onHeightChange'
  )

  t.end()
})

test('revert/PrimitiveSize: mount with correct PrimitiveSize', (t) => {
  const sizes = [{
    width: 42.879,
    height: 34.677,
  }, {
    width: 42.879,
    height: 34.677,
  }]
  const onWidthChangeSpy = createSpy(() => {})
  const onHeightChangeSpy = createSpy(() => {})
  const getRectSpy = createSpy(({ index }) => sizes[index])
  const getWidthSpy = createSpy(({ index }) => sizes[index].width)
  const getHeightSpy = createSpy(({ index }) => sizes[index].height)

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <PrimitiveSize
        width={42.879}
        height={34.677}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </PrimitiveSize>
      , {
        createNodeMock: () => {
          return {
            firstElementChild: {
              getBoundingClientRect: getRectSpy,
            },
            get offsetWidth() {
              return getWidthSpy()
            },
            get offsetHeight() {
              return getHeightSpy()
            },
          }
        },
      }
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [],
    'Mount: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [],
    'Mount: should not call onHeightChange'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.update(
      <PrimitiveSize
        width={42.879}
        height={34.677}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </PrimitiveSize>
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [],
    'Update: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [],
    'Update: should not call onHeightChange'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [],
    'Unmount: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [],
    'Unmount: should not call onHeightChange'
  )

  t.end()
})

test('revert/PrimitiveSize: call onChange again if sizes are different', (t) => {
  const sizes = [{
    width: 42,
    height: 34,
  }, {
    width: 43,
    height: 35,
  }]
  const onWidthChangeSpy = createSpy(() => {})
  const onHeightChangeSpy = createSpy(() => {})
  const getRectSpy = createSpy(({ index }) => sizes[index])
  const getWidthSpy = createSpy(({ index }) => sizes[index].width)
  const getHeightSpy = createSpy(({ index }) => sizes[index].height)

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <PrimitiveSize
        width={0}
        height={0}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </PrimitiveSize>
      , {
        createNodeMock: () => {
          return {
            firstElementChild: {
              getBoundingClientRect: getRectSpy,
            },
            get offsetWidth() {
              return getWidthSpy()
            },
            get offsetHeight() {
              return getHeightSpy()
            },
          }
        },
      }
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [
      [42],
    ],
    'Mount: should call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [34],
    ],
    'Mount: should call onHeightChange'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.update(
      <PrimitiveSize
        width={42}
        height={34}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </PrimitiveSize>
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [
      [42],
      [43],
    ],
    'Update: should call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [34],
      [35],
    ],
    'Update: should call onHeightChange'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [
      [42],
      [43],
    ],
    'Unmount: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [34],
      [35],
    ],
    'Unmount: should not call onHeightChange'
  )

  t.end()
})

test('revert/PrimitiveSize: missing part of PrimitiveSize state loop', (t) => {
  const sizes = [{
    width: 42,
    height: 34,
  }, {
    width: 43,
    height: 35,
  }]
  const onWidthChangeSpy = createSpy(() => {})
  const onHeightChangeSpy = createSpy(() => {})
  const getRectSpy = createSpy(({ index }) => sizes[index])
  const getWidthSpy = createSpy(({ index }) => sizes[index].width)
  const getHeightSpy = createSpy(({ index }) => sizes[index].height)

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <PrimitiveSize
        width={0}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </PrimitiveSize>
      , {
        createNodeMock: () => {
          return {
            firstElementChild: {
              getBoundingClientRect: getRectSpy,
            },
            get offsetWidth() {
              return getWidthSpy()
            },
            get offsetHeight() {
              return getHeightSpy()
            },
          }
        },
      }
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [],
    'Mount: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [],
    'Mount: should not call onHeightChange'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.update(
      <PrimitiveSize
        height={34}
        onWidthChange={onWidthChangeSpy}
      >
        <span/>
      </PrimitiveSize>
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [],
    'Update: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [],
    'Update: should not call onHeightChange'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [],
    'Unmount: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [],
    'Unmount: should not call onHeightChange'
  )

  t.end()
})

test('revert/PrimitiveSize: maxWidth and maxHeight', (t) => {
  const sizes = [{
    width: 42,
    height: 34,
  }, {
    width: 42,
    height: 34,
  }]
  const onWidthChangeSpy = createSpy(() => {})
  const onHeightChangeSpy = createSpy(() => {})
  const getRectSpy = createSpy(({ index }) => sizes[index])
  const getWidthSpy = createSpy(({ index }) => sizes[index].width)
  const getHeightSpy = createSpy(({ index }) => sizes[index].height)

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <PrimitiveSize
        width={0}
        height={0}
        maxWidth={30}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </PrimitiveSize>
      , {
        createNodeMock: () => {
          return {
            firstElementChild: {
              getBoundingClientRect: getRectSpy,
            },
            get offsetWidth() {
              return getWidthSpy()
            },
            get offsetHeight() {
              return getHeightSpy()
            },
          }
        },
      }
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [
      [42],
    ],
    'Mount: should call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [34],
    ],
    'Mount: should call onHeightChange'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.update(
      <PrimitiveSize
        width={42}
        height={34}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </PrimitiveSize>
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [
      [42],
    ],
    'Update: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [34],
    ],
    'Update: should not call onHeightChange'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [
      [42],
    ],
    'Unmount: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [34],
    ],
    'Unmount: should not call onHeightChange'
  )

  t.end()
})

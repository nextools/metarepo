import React from 'react'
import test from 'tape'
import { create, act, ReactTestRenderer } from 'react-test-renderer'
import { createSpy, getSpyCalls } from 'spyfn'
import { Size } from '../src/Root.web'

test('Size: standard flow', (t) => {
  const sizes = [{
    width: 42.424242,
    height: 34.343434,
  }, {
    width: 42.424242,
    height: 34.343434,
  }]
  const onWidthChangeSpy = createSpy(() => {})
  const onHeightChangeSpy = createSpy(() => {})
  const getRectSpy = createSpy(({ index }) => sizes[index])

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <Size
        width={0}
        height={0}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </Size>
      , {
        createNodeMock: () => {
          return {
            firstElementChild: {
              getBoundingClientRect: getRectSpy,
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
      <Size
        width={42.424}
        height={34.343}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </Size>
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

test('Size: mount with correct size', (t) => {
  const sizes = [{
    width: 42.878787,
    height: 34.676767,
  }, {
    width: 42.878787,
    height: 34.676767,
  }]
  const onWidthChangeSpy = createSpy(() => {})
  const onHeightChangeSpy = createSpy(() => {})
  const getRectSpy = createSpy(({ index }) => sizes[index])

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <Size
        width={42.879}
        height={34.677}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </Size>
      , {
        createNodeMock: () => {
          return {
            firstElementChild: {
              getBoundingClientRect: getRectSpy,
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
      <Size
        width={42.879}
        height={34.677}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </Size>
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

test('Size: call onChange again if sizes are different', (t) => {
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

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <Size
        width={0}
        height={0}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </Size>
      , {
        createNodeMock: () => {
          return {
            firstElementChild: {
              getBoundingClientRect: getRectSpy,
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
      <Size
        width={42}
        height={34}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </Size>
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

test('Size: missing part of size state loop', (t) => {
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

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <Size
        width={0}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </Size>
      , {
        createNodeMock: () => {
          return {
            firstElementChild: {
              getBoundingClientRect: getRectSpy,
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
      <Size
        height={34}
        onWidthChange={onWidthChangeSpy}
      >
        <span/>
      </Size>
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

test('Size: maxWidth and maxHeight', (t) => {
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

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <Size
        width={0}
        height={0}
        maxWidth={30}
        maxHeight={20}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </Size>
      , {
        createNodeMock: () => {
          return {
            firstElementChild: {
              getBoundingClientRect: getRectSpy,
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
      <Size
        width={42}
        height={34}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </Size>
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

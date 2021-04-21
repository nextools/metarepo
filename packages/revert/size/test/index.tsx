import { TransformContext } from '@revert/transform'
import { create, act } from 'react-test-renderer'
import type { ReactTestRenderer } from 'react-test-renderer'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { PrimitiveSize } from '../src/PrimitiveSize'

test('revert/PrimitiveSize: standard flow', (t) => {
  const sizes = {
    top: 0,
    left: 0,
    right: 42.424,
    bottom: 34.243,
  }
  const onWidthChangeSpy = createSpy(() => {})
  const onHeightChangeSpy = createSpy(() => {})
  const getRectSpy = createSpy(() => sizes)

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
            children: [{
              getBoundingClientRect: getRectSpy,
            }],
          }
        },
      }
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [
      [42.5],
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
        width={42.5}
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
      [42.5],
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
      [42.5],
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

test('revert/PrimitiveSize: mount with correct initial sizes', (t) => {
  const sizes = {
    left: 0,
    top: 0,
    right: 42.879,
    bottom: 34.677,
  }
  const onWidthChangeSpy = createSpy(() => {})
  const onHeightChangeSpy = createSpy(() => {})
  const getRectSpy = createSpy(() => sizes)

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <PrimitiveSize
        width={43}
        height={34.5}
        onWidthChange={onWidthChangeSpy}
        onHeightChange={onHeightChangeSpy}
      >
        <span/>
      </PrimitiveSize>
      , {
        createNodeMock: () => {
          return {
            children: [{
              getBoundingClientRect: getRectSpy,
            }],
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
        width={43}
        height={34.5}
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

test('revert/PrimitiveSize: report if measured sizes has changed', (t) => {
  const sizes = [{
    left: 0,
    top: 0,
    right: 42,
    bottom: 34,
  }, {
    left: 0,
    top: 0,
    right: 43,
    bottom: 35,
  }]
  const onWidthChangeSpy = createSpy(() => {})
  const onHeightChangeSpy = createSpy(() => {})
  const getRectSpy = createSpy(({ index }) => sizes[index])

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
            children: [{
              getBoundingClientRect: getRectSpy,
            }],
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

test('revert/PrimitiveSize: multiple children', (t) => {
  const sizes = [
    {
      left: -5,
      right: 15,
      top: 5,
      bottom: 15,
    },
    {
      left: 10,
      right: 20,
      top: 10,
      bottom: 20,
    },
  ]

  const onWidthChangeSpy = createSpy(() => {})
  const onHeightChangeSpy = createSpy(() => {})

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
        <span/>
      </PrimitiveSize>
      , {
        createNodeMock: () => {
          return {
            children: [{
              getBoundingClientRect: () => sizes[0],
            }, {
              getBoundingClientRect: () => sizes[1],
            }],
          }
        },
      }
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [
      [25],
    ],
    'Mount: should call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [15],
    ],
    'Mount: should call onHeightChange'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.update(
      <PrimitiveSize
        width={25}
        height={15}
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
      [25],
    ],
    'Update: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [15],
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
      [25],
    ],
    'Unmount: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [15],
    ],
    'Unmount: should not call onHeightChange'
  )

  t.end()
})

test('revert/PrimitiveSize: transform scale', (t) => {
  const sizes = {
    top: 0,
    left: 0,
    right: 40,
    bottom: 25,
  }
  const onWidthChangeSpy = createSpy(() => {})
  const onHeightChangeSpy = createSpy(() => {})

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <TransformContext.Provider value={{ _scale: 2 }}>
        <PrimitiveSize
          width={0}
          height={0}
          onWidthChange={onWidthChangeSpy}
          onHeightChange={onHeightChangeSpy}
        >
          <span/>
        </PrimitiveSize>
      </TransformContext.Provider>
      , {
        createNodeMock: () => {
          return {
            children: [{
              getBoundingClientRect: () => sizes,
            }],
          }
        },
      }
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [
      [20],
    ],
    'Mount: should call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [12.5],
    ],
    'Mount: should call onHeightChange'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.update(
      <TransformContext.Provider value={{ _scale: 2 }}>
        <PrimitiveSize
          width={20}
          height={12.5}
          onWidthChange={onWidthChangeSpy}
          onHeightChange={onHeightChangeSpy}
        >
          <span/>
        </PrimitiveSize>
      </TransformContext.Provider>
    )
  })

  t.deepEquals(
    getSpyCalls(onWidthChangeSpy),
    [
      [20],
    ],
    'Update: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [12.5],
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
      [20],
    ],
    'Unmount: should not call onWidthChange'
  )
  t.deepEquals(
    getSpyCalls(onHeightChangeSpy),
    [
      [12.5],
    ],
    'Unmount: should not call onHeightChange'
  )

  t.end()
})

test('revert/PrimitiveSize: maxWidth', (t) => {
  const sizes = {
    left: 0,
    top: 0,
    right: 42,
    bottom: 34,
  }
  const getRectSpy = createSpy(() => sizes)

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <PrimitiveSize>
        <span/>
      </PrimitiveSize>
      , {
        createNodeMock: () => {
          return {
            children: [{
              getBoundingClientRect: getRectSpy,
            }],
          }
        },
      }
    )
  })

  t.deepEquals(
    renderer!.toJSON(),
    {
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          width: 'max-content',
        },
      },
      children: [{ type: 'span', props: {}, children: null }],
    },
    'should not have max-width set in styles'
  )

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.update(
      <PrimitiveSize
        maxWidth={30}
      >
        <span/>
      </PrimitiveSize>
    )
  })

  t.deepEquals(
    renderer!.toJSON(),
    {
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          width: 'max-content',
          maxWidth: 30,
        },
      },
      children: [{ type: 'span', props: {}, children: null }],
    },
    'should have max-width set in styles'
  )

  t.end()
})

test('revert/PrimitiveSize: expand width', (t) => {
  const sizes = {
    left: 0,
    top: 0,
    right: 42,
    bottom: 34,
  }
  const getRectSpy = createSpy(() => sizes)

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <PrimitiveSize>
        <span/>
      </PrimitiveSize>
      , {
        createNodeMock: () => {
          return {
            children: [{
              getBoundingClientRect: getRectSpy,
            }],
          }
        },
      }
    )
  })

  t.deepEquals(
    renderer!.toJSON(),
    {
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          width: 'max-content',
        },
      },
      children: [{ type: 'span', props: {}, children: null }],
    },
    'width is set to max-content'
  )

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer.update(
      <PrimitiveSize
        width={30}
      >
        <span/>
      </PrimitiveSize>
    )
  })

  t.deepEquals(
    renderer!.toJSON(),
    {
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          width: 30,
        },
      },
      children: [{ type: 'span', props: {}, children: null }],
    },
    'width is set as defined'
  )

  t.end()
})

test('revert/PrimitiveSize: shouldPreventWrap prop', (t) => {
  const sizes = {
    left: 0,
    top: 0,
    right: 42,
    bottom: 34,
  }
  const getRectSpy = createSpy(() => sizes)

  let renderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    renderer = create(
      <PrimitiveSize shouldPreventWrap>
        <span/>
      </PrimitiveSize>
      , {
        createNodeMock: () => {
          return {
            children: [{
              getBoundingClientRect: getRectSpy,
            }],
          }
        },
      }
    )
  })

  t.deepEquals(
    renderer!.toJSON(),
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          position: 'absolute',
          left: 0,
          top: 0,
          width: 'max-content',
        },
      },
      children: [{ type: 'span', props: {}, children: null }],
    },
    'should set display to flex'
  )

  t.end()
})

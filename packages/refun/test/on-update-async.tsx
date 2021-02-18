import TestRenderer, { act } from 'react-test-renderer'
import type { ReactTestRenderer } from 'react-test-renderer'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { component, startWithType, onUpdateAsync } from '../src'

const wait = () => new Promise((res) => setImmediate(res))

test('onUpdateAsync: empty watch keys', (t) => {
  const functionsReveived: any[] = []
  const gen = function *(...args: any[]) {
    functionsReveived.push(args[0].cancelOthers)
    yield Promise.resolve(42)
  }
  const generatorSpy = createSpy(({ args }) => gen(...args))
  const onUpdateAsyncSpy = createSpy(() => generatorSpy)
  const componentSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: string }>(),
    onUpdateAsync(onUpdateAsyncSpy, [])
  )(componentSpy)

  let testRenderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onUpdateAsyncSpy),
    [
      [{ current: { foo: 'foo' } }], // Mount
    ],
    'Mount: should call onUpdate'
  )

  t.deepEquals(
    getSpyCalls(generatorSpy),
    [
      [{ cancelOthers: functionsReveived[0], index: 0 }], // Mount
    ],
    'Mount: should call generator'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp foo="bar"/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
      [{ foo: 'bar' }], // Update
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onUpdateAsyncSpy),
    [
      [{ current: { foo: 'bar' } }], // Mount
    ],
    'Update: should not call update if array was empty'
  )

  t.deepEquals(
    getSpyCalls(generatorSpy),
    [
      [{ cancelOthers: functionsReveived[0], index: 0 }], // Mount
    ],
    'Mount: should not call generator'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onUpdateAsyncSpy),
    [
      [{ current: { foo: 'bar' } }], // Mount
    ],
    'Unmount: should not call update'
  )

  t.deepEquals(
    getSpyCalls(generatorSpy),
    [
      [{ cancelOthers: functionsReveived[0], index: 0 }], // Mount
    ],
    'Mount: should not call generator'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})

test('onUpdateAsync: switch coroutine, watch keys', async (t) => {
  const functionsReceived: any[] = []
  const resolves: any[] = []
  const intermediateSpy = createSpy(() => {})
  const gen = function *(...args: any[]) {
    const { cancelOthers, index } = args[0]

    functionsReceived.push(cancelOthers)
    cancelOthers()

    yield new Promise((res) => {
      resolves.push(res)
    })

    intermediateSpy(index)
  }
  const generatorSpy = createSpy(({ args }) => gen(...args))
  const onUpdateAsyncSpy = createSpy(() => generatorSpy)
  const componentSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: string, bar: string }>(),
    onUpdateAsync(onUpdateAsyncSpy, ['foo'])
  )(componentSpy)

  let testRenderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo="foo"
        bar="bar"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', bar: 'bar' }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onUpdateAsyncSpy),
    [
      [{ current: { foo: 'foo', bar: 'bar' } }], // Mount
    ],
    'Mount: should call update'
  )

  t.deepEquals(
    getSpyCalls(generatorSpy),
    [
      [{ cancelOthers: functionsReceived[0], index: 0 }], // Mount
    ],
    'Mount: should call generator'
  )

  /* Update not watched prop */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo="foo"
        bar="baz"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', bar: 'bar' }], // Mount
      [{ foo: 'foo', bar: 'baz' }], // Update not watched prop
    ],
    'Update not watched prop: should pass props'
  )

  /* Update watched prop */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo="bar"
        bar="baz"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', bar: 'bar' }], // Mount
      [{ foo: 'foo', bar: 'baz' }], // Update not watched prop
      [{ foo: 'bar', bar: 'baz' }], // Update watched prop
    ],
    'Update watched prop: should pass props'
  )

  t.deepEquals(
    getSpyCalls(generatorSpy),
    [
      [{ cancelOthers: functionsReceived[0], index: 0 }], // Mount
      [{ cancelOthers: functionsReceived[1], index: 1 }], // Update watched prop
    ],
    'Update watched prop: should call generator'
  )

  /* Step generators */
  await act(async () => {
    resolves[0]()
    resolves[1]()
    // Wait for promises to resolve
    await wait()
  })

  t.deepEquals(
    getSpyCalls(intermediateSpy),
    [
      [1],
    ],
    'Step generators: should continue only with one generator'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onUpdateAsyncSpy),
    [
      [{ current: { foo: 'bar', bar: 'baz' } }], // Mount, Update watched prop
    ],
    'Unmount: should not call update'
  )

  t.deepEquals(
    getSpyCalls(generatorSpy),
    [
      [{ cancelOthers: functionsReceived[0], index: 0 }], // Mount
      [{ cancelOthers: functionsReceived[1], index: 1 }], // Update watched prop
    ],
    'Unmount: should not call generator'
  )

  t.equals(
    getNumRenders(),
    3,
    'Render: should render component exact times'
  )

  t.end()
})

test('onUpdateAsync: coroutine unmount, watch keys', async (t) => {
  const functionsReceived: any[] = []
  const resolves: any[] = []
  const intermediateSpy = createSpy(() => {})
  const gen = function *(...args: any[]) {
    const { cancelOthers, index } = args[0]

    functionsReceived.push(cancelOthers)

    yield new Promise((res) => {
      resolves.push(res)
    })

    intermediateSpy(index)
  }
  const generatorSpy = createSpy(({ args }) => gen(...args))
  const onUpdateAsyncSpy = createSpy(() => generatorSpy)
  const componentSpy = createSpy(() => null)
  const MyComp = component(
    startWithType<{ foo: string }>(),
    onUpdateAsync(onUpdateAsyncSpy, ['foo'])
  )(componentSpy)

  let testRenderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onUpdateAsyncSpy),
    [
      [{ current: { foo: 'foo' } }], // Mount
    ],
    'Mount: should call update'
  )

  t.deepEquals(
    getSpyCalls(generatorSpy),
    [
      [{ cancelOthers: functionsReceived[0], index: 0 }], // Mount
    ],
    'Mount: should call generator'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onUpdateAsyncSpy),
    [
      [{ current: { foo: 'foo' } }], // Mount, Update watched prop
    ],
    'Unmount: should not call update'
  )

  t.deepEquals(
    getSpyCalls(generatorSpy),
    [
      [{ cancelOthers: functionsReceived[0], index: 0 }], // Mount
    ],
    'Unmount: should not call generator'
  )

  /* Step generators */
  await act(async () => {
    resolves[0]()
    // Wait for promises to resolve
    await wait()
  })

  t.deepEquals(
    getSpyCalls(intermediateSpy),
    [],
    'Step generators: should not continue generator'
  )

  t.end()
})

test('onUpdateAsync: coroutine reject, watch keys', async (t) => {
  const functionsReceived: any[] = []
  const rejects: any[] = []
  const intermediateSpy = createSpy(() => {})
  const gen = function *(...args: any[]) {
    const { cancelOthers, index } = args[0]

    functionsReceived.push(cancelOthers)

    try {
      yield new Promise((res, rej) => {
        rejects.push(rej)
      })
    } catch {}

    intermediateSpy(index)
  }
  const generatorSpy = createSpy(({ args }) => gen(...args))
  const onUpdateAsyncSpy = createSpy(() => generatorSpy)
  const componentSpy = createSpy(() => null)
  const MyComp = component(
    startWithType<{ foo: string }>(),
    onUpdateAsync(onUpdateAsyncSpy, ['foo'])
  )(componentSpy)

  let testRenderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onUpdateAsyncSpy),
    [
      [{ current: { foo: 'foo' } }], // Mount
    ],
    'Mount: should call update'
  )

  t.deepEquals(
    getSpyCalls(generatorSpy),
    [
      [{ cancelOthers: functionsReceived[0], index: 0 }], // Mount
    ],
    'Mount: should call generator'
  )

  /* Step generators */
  await act(async () => {
    rejects[0]()
    // Wait for promises to resolve
    await wait()
  })

  t.deepEquals(
    getSpyCalls(intermediateSpy),
    [
      [0],
    ],
    'Step generators: should continue generator'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onUpdateAsyncSpy),
    [
      [{ current: { foo: 'foo' } }], // Mount, Update watched prop
    ],
    'Unmount: should not call update'
  )

  t.deepEquals(
    getSpyCalls(generatorSpy),
    [
      [{ cancelOthers: functionsReceived[0], index: 0 }], // Mount
    ],
    'Unmount: should not call generator'
  )

  t.end()
})

test('onUpdateAsync: coroutine reject unmount, watch keys', async (t) => {
  const functionsReceived: any[] = []
  const rejects: any[] = []
  const intermediateSpy = createSpy(() => {})
  const gen = function *(...args: any[]) {
    const { cancelOthers, index } = args[0]

    functionsReceived.push(cancelOthers)

    try {
      yield new Promise((res, rej) => {
        rejects.push(rej)
      })
    } catch {}

    intermediateSpy(index)
  }
  const generatorSpy = createSpy(({ args }) => gen(...args))
  const onUpdateAsyncSpy = createSpy(() => generatorSpy)
  const componentSpy = createSpy(() => null)
  const MyComp = component(
    startWithType<{ foo: string }>(),
    onUpdateAsync(onUpdateAsyncSpy, ['foo'])
  )(componentSpy)

  let testRenderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp foo="foo"/>
    )
  })

  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo' }], // Mount
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(onUpdateAsyncSpy),
    [
      [{ current: { foo: 'foo' } }], // Mount
    ],
    'Mount: should call update'
  )

  t.deepEquals(
    getSpyCalls(generatorSpy),
    [
      [{ cancelOthers: functionsReceived[0], index: 0 }], // Mount
    ],
    'Mount: should call generator'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(onUpdateAsyncSpy),
    [
      [{ current: { foo: 'foo' } }], // Mount, Update watched prop
    ],
    'Unmount: should not call update'
  )

  t.deepEquals(
    getSpyCalls(generatorSpy),
    [
      [{ cancelOthers: functionsReceived[0], index: 0 }], // Mount
    ],
    'Unmount: should not call generator'
  )

  /* Step generators */
  await act(async () => {
    rejects[0]()
    // Wait for promises to resolve
    await wait()
  })

  t.deepEquals(
    getSpyCalls(intermediateSpy),
    [],
    'Step generators: should not continue generator'
  )

  t.end()
})

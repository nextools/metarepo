import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { Store } from 'redux'
import { component, startWithType, StoreContextFactory } from '../src'

test('StoreContextFactory', (t) => {
  let subscriber: any
  const unsubscribeSpy = createSpy(() => {})
  const subscribeSpy = createSpy(({ args }) => {
    subscriber = args[0]

    return unsubscribeSpy
  })
  const stateValues = [
    { a: 4, b: '' }, // initial value
    { a: 4, b: 'bar' }, // update unwatched value
    { a: 8, b: 'bar' }, // update watched value
  ]
  const getStateSpy = createSpy(({ index }) => stateValues[index])
  const mapStateSpy = createSpy(({ args }) => ({ result: args[0].a * 2 }))
  const dispatch = (_: any) => _
  const store = { getState: getStateSpy, dispatch, subscribe: subscribeSpy } as Store<{a: number, b: string}>
  const { mapStoreState, mapStoreDispatch } = StoreContextFactory(store)
  const componentSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(componentSpy).length
  const MyComp = component(
    startWithType<{ foo: string }>(),
    mapStoreState(mapStateSpy, ['a']),
    mapStoreDispatch('dispatch')
  )(componentSpy)

  let testRenderer: ReactTestRenderer

  /* Mount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo="foo"
      />
    )
  })
  // subscribe called
  t.deepEquals(
    getSpyCalls(subscribeSpy),
    [
      [subscriber],
    ],
    'Mount: should call subscribe'
  )
  // unsubscribe not called
  t.deepEquals(
    getSpyCalls(unsubscribeSpy),
    [],
    'Mount: should not call unsubscribe'
  )
  // getState called
  t.deepEquals(
    getSpyCalls(getStateSpy),
    [
      [],
    ],
    'Mount: should call getState'
  )
  // mapState called
  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }],
    ],
    'Mount: should call map function'
  )
  // render
  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', result: 8, dispatch }], // Mount
    ],
    'Mount: should pass props'
  )

  /* Update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.update(
      <MyComp
        foo="bar"
      />
    )
  })
  // subscribe not called
  t.deepEquals(
    getSpyCalls(subscribeSpy),
    [
      [subscriber],
    ],
    'Update: should not call subscribe'
  )
  // unsubscribe not called
  t.deepEquals(
    getSpyCalls(unsubscribeSpy),
    [],
    'Update: should not call unsubscribe'
  )
  // getState not called
  t.deepEquals(
    getSpyCalls(getStateSpy),
    [
      [],
    ],
    'Update: should not call getState'
  )
  // mapState not called
  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }],
    ],
    'Update: should not call map function'
  )
  // render
  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', result: 8, dispatch }], // Mount
      [{ foo: 'bar', result: 8, dispatch }], // Update
    ],
    'Update: should pass props'
  )

  /* Update Store unwatched value */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    // kick subscriber
    subscriber()
  })
  // subscribe not called
  t.deepEquals(
    getSpyCalls(subscribeSpy),
    [
      [subscriber],
    ],
    'Update Store unwatched value: should not call subscribe'
  )
  // unsubscribe not called
  t.deepEquals(
    getSpyCalls(unsubscribeSpy),
    [],
    'Update Store unwatched value: should not call unsubscribe'
  )
  // getState called
  t.deepEquals(
    getSpyCalls(getStateSpy),
    [
      [],
      [],
    ],
    'Update Store unwatched value: should call getState'
  )
  // mapState not called
  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }],
    ],
    'Update Store unwatched value: should not call map function'
  )
  // render
  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', result: 8, dispatch }], // Mount
      [{ foo: 'bar', result: 8, dispatch }], // Update
    ],
    'Update Store unwatched value: should not rerender'
  )

  /* Store watched update */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    // kick subscriber
    subscriber()
  })
  // subscribe not called
  t.deepEquals(
    getSpyCalls(subscribeSpy),
    [
      [subscriber],
    ],
    'Update Store watched value: should not call subscribe'
  )
  // unsubscribe not called
  t.deepEquals(
    getSpyCalls(unsubscribeSpy),
    [],
    'Update Store watched value: should not call unsubscribe'
  )
  // getState called
  t.deepEquals(
    getSpyCalls(getStateSpy),
    [
      [],
      [],
      [],
    ],
    'Update Store watched value: should call getState'
  )
  // mapState called
  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }],
      [{ a: 8, b: 'bar' }],
    ],
    'Update Store watched value: should call map function'
  )
  // render
  t.deepEquals(
    getSpyCalls(componentSpy),
    [
      [{ foo: 'foo', result: 8, dispatch }], // Mount
      [{ foo: 'bar', result: 8, dispatch }], // Update
      [{ foo: 'bar', result: 16, dispatch }], // Update Store watched value
    ],
    'Update Store watched value: should pass props'
  )

  /* Unmount */
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer.unmount()
  })
  // subscribe not called
  t.deepEquals(
    getSpyCalls(subscribeSpy),
    [
      [subscriber],
    ],
    'Unmount: should not call subscribe'
  )
  // unsubscribe called
  t.deepEquals(
    getSpyCalls(unsubscribeSpy),
    [
      [],
    ],
    'Unmount: should call unsubscribe'
  )
  // getState not called
  t.deepEquals(
    getSpyCalls(getStateSpy),
    [
      [],
      [],
      [],
    ],
    'Unmount: should not call getState'
  )
  // mapState not called
  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ a: 4, b: '' }],
      [{ a: 8, b: 'bar' }],
    ],
    'Unmount: should not call map function'
  )

  t.equals(
    getNumRenders(),
    3,
    'Render: should render component exact times'
  )

  t.end()
})

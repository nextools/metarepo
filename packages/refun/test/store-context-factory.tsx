import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import test from 'blue-tape'
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
  const { StoreProvider, mapStoreState, mapStoreDispatch } = StoreContextFactory(store)
  const compSpy = createSpy(() => null)
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: string }>(),
    mapStoreState(mapStateSpy, ['a']),
    mapStoreDispatch
  )(compSpy)

  /* Mount */
  let testRenderer: any
  act(() => {
    testRenderer = TestRenderer.create(
      <StoreProvider>
        <MyComp
          foo="foo"
        />
      </StoreProvider>
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
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', result: 8, dispatch }], // Mount
    ],
    'Mount: should pass props'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <StoreProvider>
        <MyComp
          foo="bar"
        />
      </StoreProvider>
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
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', result: 8, dispatch }], // Mount
      [{ foo: 'bar', result: 8, dispatch }], // Update
    ],
    'Update: should pass props'
  )

  /* Update Store unwatched value */
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
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', result: 8, dispatch }], // Mount
      [{ foo: 'bar', result: 8, dispatch }], // Update
      [{ foo: 'bar', result: 8, dispatch }], // Update Store unwatched value
    ],
    'Update Store unwatched value: should pass props'
  )

  /* Store watched update */
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
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', result: 8, dispatch }], // Mount
      [{ foo: 'bar', result: 8, dispatch }], // Update
      [{ foo: 'bar', result: 8, dispatch }], // Update Store unwatched value
      [{ foo: 'bar', result: 16, dispatch }], // Update Store watched value
    ],
    'Update Store unwatched value: should pass props'
  )

  /* Unmount */
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
    4,
    'Render: should render component exact times'
  )

  t.end()
})

test('StoreContextFactory: null state case', (t) => {
  let subscriber: any
  const unsubscribeSpy = createSpy(() => {})
  const subscribeSpy = createSpy(({ args }) => {
    subscriber = args[0]

    return unsubscribeSpy
  })
  const getStateSpy = createSpy(() => null)
  const dispatch = (_: any) => _
  const store = { getState: getStateSpy as any, dispatch, subscribe: subscribeSpy } as Store<{}>
  const { StoreProvider } = StoreContextFactory(store)
  const compSpy = createSpy(() => null)
  const MyComp = component((p) => p)(compSpy)

  /* Mount */
  let testRenderer: any
  act(() => {
    testRenderer = TestRenderer.create(
      <StoreProvider>
        <MyComp/>
      </StoreProvider>
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

  // component not rendered
  t.deepEquals(
    getSpyCalls(compSpy),
    [],
    'Mount: should not render component'
  )

  /* Update Store */
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
    'Update Store: should call subscribe'
  )

  // unsubscribe not called
  t.deepEquals(
    getSpyCalls(unsubscribeSpy),
    [],
    'Update Store: should not call unsubscribe'
  )

  // getState called
  t.deepEquals(
    getSpyCalls(getStateSpy),
    [
      [],
      [],
    ],
    'Update Store: should call getState'
  )

  // component not rendered
  t.deepEquals(
    getSpyCalls(compSpy),
    [],
    'Update Store: should not render component'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  // unsubscribe called
  t.deepEquals(
    getSpyCalls(unsubscribeSpy),
    [
      [],
    ],
    'Mount: should call unsubscribe'
  )

  t.end()
})

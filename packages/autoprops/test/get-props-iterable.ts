import { mockRequire } from '@mock/require'
import test from 'tape'
import { getPropsIterable, mapPropsIterable } from '../src'
import { TComponentConfig } from '../src/types'

test('getPropsIterable: props', (t) => {
  const config: TComponentConfig<{a: boolean}, never> = {
    props: {
      a: [true],
    },
  }

  t.deepEquals(
    Array.from(getPropsIterable(config)),
    [
      {
        id: 'bf21a9e8fbc5a3846fb05b4fa0859e0917b2202f',
        props: {},
        progress: 50,
      },
      {
        id: 'fcf68a8de376de60c4e80efed225876a29c5a4b1',
        props: { a: true },
        progress: 100,
      },
    ],
    'should iterate props'
  )

  t.end()
})

test('getPropsIterable: childrenMap', async (t) => {
  const unmockRequire = mockRequire('../src/get-props-iterable', {
    '../src/create-children': {
      createChildren: (_: any, map: any) => map,
    },
  })

  const { getPropsIterable } = await import('../src/get-props-iterable')

  const config: TComponentConfig<{ a: boolean }, 'child2' | 'child'> = {
    props: {
      a: [true],
    },
    children: {
      child2: {
        config: {
          props: {},
        },
        Component: () => null,
      },
      child: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
    required: ['a', 'child'],
  }

  t.deepEquals(
    Array.from(getPropsIterable(config)),
    [
      {
        id: 'daf5771c75b30f5a94a20d77342d98c7775762df',
        props: {
          a: true,
          children: {
            child: {},
          },
        },
        progress: 50,
      },
      {
        id: 'df0324eb6ae2dc6712984cd6d97c5759904a8f65',
        props: {
          a: true,
          children: {
            child: {},
            child2: {},
          },
        },
        progress: 100,
      },
    ],
    'should iterate props'
  )

  unmockRequire()
})

test('mapPropsIterable', (t) => {
  const config: TComponentConfig<{a: boolean}, never> = {
    props: {
      a: [true],
    },
  }

  t.deepEquals(
    Array.from(mapPropsIterable(config, (obj) => obj)),
    [
      {
        id: 'bf21a9e8fbc5a3846fb05b4fa0859e0917b2202f',
        props: {},
        progress: 50,
      },
      {
        id: 'fcf68a8de376de60c4e80efed225876a29c5a4b1',
        props: { a: true },
        progress: 100,
      },
    ],
    'should iterate props'
  )

  t.end()
})

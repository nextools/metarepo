import test from 'tape'
import { mockRequire } from '@mock/require'
import { TComponentConfig } from '../src/types'
import { getPropsIterable, mapPropsIterable } from '../src'

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
        id: 'vyGp6PvFo4RvsFtPoIWeCReyIC8=',
        props: {},
        progress: 50,
      },
      {
        id: '/PaKjeN23mDE6A7+0iWHainFpLE=',
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
        id: '2vV3HHWzD1qUog13NC2Yx3dXYt8=',
        props: {
          a: true,
          children: {
            child: {},
          },
        },
        progress: 50,
      },
      {
        id: '3wMk62ri3GcSmEzW2XxXWZBKj2U=',
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
        id: 'vyGp6PvFo4RvsFtPoIWeCReyIC8=',
        props: {},
        progress: 50,
      },
      {
        id: '/PaKjeN23mDE6A7+0iWHainFpLE=',
        props: { a: true },
        progress: 100,
      },
    ],
    'should iterate props'
  )

  t.end()
})

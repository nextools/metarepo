import test from 'blue-tape'
import { mock } from 'mocku'
import { TChildrenConfig } from '../src'

test('createChildren', async (t) => {
  const unmockCreateChildren = mock('../src/create-children', {
    react: {
      createElement: (comp: any, props: any, children: any) => ({
        comp,
        props,
        children,
      }),
      isValidElement: () => false,
    },
  })

  const { createChildren } = await import('../src/create-children')

  const Comp = () => null
  const config: TChildrenConfig = {
    meta: {
      child: {
        config: {
          props: {
            a: [true],
          },
        },
        childrenConfig: {
          meta: {
            child1: {
              config: {
                props: {},
              },
              Component: Comp,
            },
            child2: {
              config: {
                props: {},
              },
              Component: Comp,
            },
          },
          children: ['child1', 'child2'],
        },
        Component: Comp,
      },
    },
    children: ['child'],
  }

  t.deepEquals(
    createChildren(config, {
      child__0: {
        a: true,
        children: {
          child1__0: {},
          child2__0: {},
        },
      },
    }),
    {
      comp: Comp,
      props: { a: true, key: 0 },
      children: [
        {
          comp: Comp,
          props: { key: 0 },
          children: undefined,
        },
        {
          comp: Comp,
          props: { key: 1 },
          children: undefined,
        },
      ],
    },
    'should return proper children'
  )

  unmockCreateChildren()
})

test('createChildren: errors', async (t) => {
  const { createChildren } = await import('../src/create-children')

  const Comp = () => null
  const config: TChildrenConfig = {
    meta: {
      child: {
        config: {
          props: {
            a: [true],
          },
        },
        Component: Comp,
      },
    },
    children: ['child'],
  }

  t.throws(
    () => createChildren(config, {
      child__0: {
        a: true,
        children: {
          child__0: {},
        },
      },
    }),
    /childrenConfig/,
    'should throw if childrenConfig is missing'
  )
})

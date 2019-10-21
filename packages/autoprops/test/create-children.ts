import test from 'blue-tape'
import { mock } from 'mocku'
import { TComponentConfig } from '../src/types'

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
  const config: TComponentConfig = {
    props: {},
    children: {
      child: {
        config: {
          props: {
            a: [true],
          },
          children: {
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
        },
        Component: Comp,
      },
      childNotCreated: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
  }

  t.deepEquals(
    createChildren(config, {
      child: {
        a: true,
        children: {
          child1: {},
          child2: {},
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

  t.throws(
    () => createChildren({
      props: {},
      children: {
        child: {
          config: {
            props: {
              a: [true],
            },
          },
          Component: () => null,
        },
      },
    }, {
      child: {
        a: true,
        children: {
          child: {},
        },
      },
    }),
    /childrenConfig/,
    'should throw if childrenConfig is missing'
  )

  t.throws(
    () => createChildren({
      props: {},
    }, {
      child: {
        a: true,
        children: {
          child: {},
        },
      },
    }),
    /childrenConfig/,
    'should throw if childrenConfig is missing'
  )
})

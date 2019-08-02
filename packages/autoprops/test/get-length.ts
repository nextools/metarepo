import test from 'blue-tape'
import { TMetaFile } from '../src/types'
import { getLength } from '../src/get-length'

test('react-autoprops: getLength', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
        b: [true],
      },
      required: ['a'],
    },
    childrenConfig: {
      meta: {
        child1: {
          config: {
            props: {},
          },
          Component: () => null,
        },
        child2: {
          config: {
            props: {},
          },
          childrenConfig: {
            meta: {
              child: {
                config: {
                  props: {
                    a: [true],
                  },
                },
                Component: () => null,
              },
            },
            children: ['child'],
          },
          Component: () => null,
        },
      },
      children: ['child1', 'child1', 'child2'],
      required: ['child1'],
    },
    Component: () => null,
  }

  t.equals(
    getLength(meta),
    8n,
    'should return proper length'
  )

  t.end()
})

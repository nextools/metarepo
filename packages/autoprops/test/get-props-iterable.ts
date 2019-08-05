import test from 'blue-tape'
import { TMetaFile } from '../src/types'
import { getPropsIterable } from '../src'

test('getPropsIterable', (t) => {
  const meta: TMetaFile = {
    config: {
      props: {
        a: [true],
      },
    },
    Component: () => null,
  }

  t.deepEquals(
    Array.from(getPropsIterable(meta)),
    [{}, { a: true }],
    'should iterate props'
  )

  t.end()
})

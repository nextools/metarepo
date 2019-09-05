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
    [
      {
        id: 'vyGp6PvFo4RvsFtPoIWeCReyIC8=',
        props: {},
      },
      {
        id: '/PaKjeN23mDE6A7+0iWHainFpLE=',
        props: { a: true },
      },
    ],
    'should iterate props'
  )

  t.end()
})

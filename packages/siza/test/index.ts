import test from 'blue-tape'
import { getBundleSize } from '../src'

test('siza', async (t) => {
  const result = await getBundleSize({
    entryPointPath: require.resolve('./fixtures/App'),
  })

  t.deepEquals(
    result,
    {
      vendor: { min: 129231, minGzip: 40706 },
      main: { min: 293, minGzip: 214 },
    },
    'should work'
  )
})

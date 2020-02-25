import test from 'blue-tape'
import { getBundleSize } from '../src'

test('siza', async (t) => {
  const result = await getBundleSize({
    entryPointPath: require.resolve('./fixtures/App'),
  })

  t.true(
    typeof result.vendor.min === 'number',
    'vendor.min'
  )

  t.true(
    typeof result.vendor.minGzip === 'number',
    'vendor.minGzip'
  )

  t.true(
    typeof result.main.min === 'number',
    'main.min'
  )

  t.true(
    typeof result.main.minGzip === 'number',
    'main.minGzip'
  )
})

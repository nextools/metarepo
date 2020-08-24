import test from 'tape'
import { compileBumpConfig } from '../../src/bump/compile-bump-config'

test('compile-auto-config', (t) => {
  t.deepEquals(
    compileBumpConfig(),
    {
      shouldAlwaysBumpDependents: false,
    },
    'default config'
  )

  t.deepEquals(
    compileBumpConfig({
      shouldAlwaysBumpDependents: true,
    }),
    {
      shouldAlwaysBumpDependents: true,
    },
    'root config'
  )

  t.deepEquals(
    compileBumpConfig({
      shouldAlwaysBumpDependents: true,
    }, {
      shouldAlwaysBumpDependents: false,
    }),
    {
      shouldAlwaysBumpDependents: false,
    },
    'local config'
  )

  t.end()
})

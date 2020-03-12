import test from 'tape'
import { getDependentsCount } from '../../src/utils/get-dependents-count'

test('workspaces:getDependentsCount', (t) => {
  t.equals(
    getDependentsCount({
      deps: {
        a: '1.1.1',
      },
      devDeps: null,
    }),
    1,
    '1 deps'
  )

  t.equals(
    getDependentsCount({
      deps: null,
      devDeps: {
        a: '1.1.1',
      },
    }),
    1,
    '1 devDeps'
  )

  t.equals(
    getDependentsCount({
      deps: {
        a: '1.1.1',
      },
      devDeps: {
        a: '1.1.1',
      },
    }),
    2,
    '1 deps + 1 devDeps'
  )

  t.end()
})

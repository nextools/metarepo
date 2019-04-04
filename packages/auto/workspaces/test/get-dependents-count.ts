import test from 'blue-tape'
import { getDependentsCount } from '../src/get-dependents-count'

test('workspaces:getDependentsCount', (t) => {
  t.equals(
    getDependentsCount({
      name: 'a',
      dir: 'fakes/a',
      version: null,
      type: null,
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
      name: 'a',
      dir: 'fakes/a',
      version: null,
      type: null,
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
      name: 'a',
      dir: 'fakes/a',
      version: null,
      type: null,
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

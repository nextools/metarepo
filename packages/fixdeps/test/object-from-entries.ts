import test from 'blue-tape'
import { objectFromEntries } from '../src/object-from-entries'

test('objectFromEntries', (t) => {
  t.deepEquals(
    objectFromEntries([
      ['execa', '^1.0.0'],
      ['@babel/runtime', '^1.7.0'],
      ['@ns/a', '^1.5.2'],
    ]),
    {
      '@babel/runtime': '^1.7.0',
      '@ns/a': '^1.5.2',
      execa: '^1.0.0',
    },
    'should make object from list'
  )

  t.end()
})

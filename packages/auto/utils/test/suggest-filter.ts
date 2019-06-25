import test from 'blue-tape'
import { suggestFilter } from '../src/suggest-filter'

test('git:makeCommit: suggestFilter', async (t) => {
  t.deepEquals(
    await suggestFilter('(no package)')(
      '',
      [
        { title: 'foo', value: 'foo' },
        { title: 'bar', value: 'bar' },
        { title: 'foo-', value: 'foo-' },
        { title: '-bar', value: '-bar' },
        { title: 'foo-bar', value: 'foo-bar' },
      ]
    ),
    [
      { title: '(no package)', value: '-' },
      { title: 'foo', value: 'foo' },
      { title: 'bar', value: 'bar' },
      { title: 'foo-', value: 'foo-' },
      { title: '-bar', value: '-bar' },
      { title: 'foo-bar', value: 'foo-bar' },
    ],
    'empty string'
  )

  t.deepEquals(
    await suggestFilter('(no package)')(
      '-',
      [
        { title: 'foo', value: 'foo' },
        { title: 'bar', value: 'bar' },
        { title: '-', value: '-' },
        { title: 'foo-', value: 'foo-' },
        { title: '-bar', value: '-bar' },
        { title: 'foo-bar', value: 'foo-bar' },
      ]
    ),
    [
      { title: '-', value: '-' },
      { title: 'foo-', value: 'foo-' },
      { title: '-bar', value: '-bar' },
      { title: 'foo-bar', value: 'foo-bar' },
    ],
    'string'
  )

  t.deepEquals(
    await suggestFilter('(no package)')(
      '*',
      [
        { title: 'foo', value: 'foo' },
        { title: 'bar', value: 'bar' },
        { title: 'foo-', value: 'foo-' },
        { title: '-bar', value: '-bar' },
        { title: 'foo-bar', value: 'foo-bar' },
      ]
    ),
    [
      { title: '* (5)', value: '*' },
      { title: 'foo', value: 'foo' },
      { title: 'bar', value: 'bar' },
      { title: 'foo-', value: 'foo-' },
      { title: '-bar', value: '-bar' },
      { title: 'foo-bar', value: 'foo-bar' },
    ],
    'star symbol'
  )

  t.deepEquals(
    await suggestFilter('(no package)')(
      '-*',
      [
        { title: 'foo', value: 'foo' },
        { title: 'bar', value: 'bar' },
        { title: 'foo-', value: 'foo-' },
        { title: '-bar', value: '-bar' },
        { title: 'foo-bar', value: 'foo-bar' },
      ]
    ),
    [
      { title: '-* (3)', value: '-*' },
      { title: 'foo-', value: 'foo-' },
      { title: '-bar', value: '-bar' },
      { title: 'foo-bar', value: 'foo-bar' },
    ],
    'string + star symbol'
  )
})

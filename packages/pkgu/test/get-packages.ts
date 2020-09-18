/* eslint-disable node/no-sync */
import path from 'path'
import { mockFs } from '@mock/fs'
import test from 'tape'

test('pkgu: getPackages', async (t) => {
  const cwd = process.cwd()
  const { fs, unmockFs } = mockFs('../src')

  fs.mkdirpSync(path.join(cwd, 'packages/foo'))
  fs.mkdirpSync(path.join(cwd, 'packages/bar'))
  fs.mkdirpSync(path.join(cwd, 'packages/baz'))

  fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({
    workspaces: ['packages/*'],
  }))
  fs.writeFileSync(path.join(cwd, 'packages/foo/package.json'), JSON.stringify({
    name: 'foo',
    version: '1.0.0',
  }))
  fs.writeFileSync(path.join(cwd, 'packages/bar/package.json'), JSON.stringify({
    name: 'bar',
    version: '2.0.0',
  }))
  fs.writeFileSync(path.join(cwd, 'packages/baz/package.json'), JSON.stringify({
    name: 'baz',
    version: '3.0.0',
  }))

  const { getPackages } = await import('../src')

  const result = await getPackages()

  t.deepEqual(
    result,
    new Map([
      ['bar', {
        dir: path.join(cwd, 'packages/bar'),
        json: { name: 'bar', version: '2.0.0' },
      }],
      ['baz', {
        dir: path.join(cwd, 'packages/baz'),
        json: { name: 'baz', version: '3.0.0' },
      }],
      ['foo', {
        dir: path.join(cwd, 'packages/foo'),
        json: { name: 'foo', version: '1.0.0' },
      }],
    ]),
    'should work'
  )

  unmockFs()
})

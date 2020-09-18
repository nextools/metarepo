/* eslint-disable node/no-sync */
import path from 'path'
import { mockFs } from '@mock/fs'
import test from 'tape'

test('pkgu: readPackageJson', async (t) => {
  const pkgDir = '/packages/foo'
  const { fs, unmockFs } = mockFs('../src')

  fs.mkdirpSync(pkgDir)

  fs.writeFileSync(path.join(pkgDir, 'package.json'), JSON.stringify({
    name: 'foo',
    version: '1.0.0',
  }))

  const { readPackageJson } = await import('../src')

  const result = await readPackageJson(pkgDir)

  t.deepEqual(
    result,
    {
      name: 'foo',
      version: '1.0.0',
    },
    'should work'
  )

  unmockFs()
})

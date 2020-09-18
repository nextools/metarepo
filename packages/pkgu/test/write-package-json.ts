/* eslint-disable node/no-sync */
import path from 'path'
import { mockFs } from '@mock/fs'
import test from 'tape'

test('pkgu: writePackageJson', async (t) => {
  const pkgDir = '/packages/foo'
  const pkgJsonPath = path.join(pkgDir, 'package.json')
  const { fs, unmockFs } = mockFs('../src')

  fs.mkdirpSync(pkgDir)

  fs.writeFileSync(pkgJsonPath, JSON.stringify({
    name: 'foo',
    version: '1.0.0',
  }))

  const { writePackageJson } = await import('../src')

  await writePackageJson(pkgDir, {
    name: 'foo',
    version: '2.0.0',
  })

  const result = fs.readFileSync(pkgJsonPath, 'utf8') as string

  t.deepEqual(
    JSON.parse(result),
    {
      name: 'foo',
      version: '2.0.0',
    },
    'should work'
  )

  unmockFs()
})

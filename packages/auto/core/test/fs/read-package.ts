import { promisify } from 'util'
import { mockRequire } from '@mock/require'
import { createFsFromVolume, Volume } from 'memfs'
import test from 'tape'

const rootDir = process.cwd()
const vol = Volume.fromJSON({
  [`${rootDir}/package.json`]: JSON.stringify({
    name: '@ns/a',
    version: '1.0.0',
  }),
})
const fs = createFsFromVolume(vol)

test('fs:readPackage', async (t) => {
  const unmockRequire = mockRequire('../../src/fs/read-package', {
    pifs: {
      readFile: promisify(fs.readFile),
    },
  })

  const { readPackage } = await import('../../src/fs/read-package')

  t.deepEquals(
    await readPackage(rootDir),
    {
      name: '@ns/a',
      version: '1.0.0',
    },
    'should get package content'
  )

  unmockRequire()
})

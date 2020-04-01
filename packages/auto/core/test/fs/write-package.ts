import { promisify } from 'util'
import test from 'tape'
import { mockRequire } from '@mock/require'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()

test('fs:writePackage', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: '',
  })
  const fs = createFsFromVolume(vol)
  const unmockRequire = mockRequire('../../src/fs/write-package', {
    pifs: {
      writeFile: promisify(fs.writeFile),
    },
  })

  const { writePackage } = await import('../../src/fs/write-package')

  await writePackage(`${rootDir}/fakes/a`, {
    name: '@ns/a',
    version: '1.0.0',
  })

  // eslint-disable-next-line no-sync
  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8') as string
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0',
    },
    'should get package content'
  )

  unmockRequire()
})

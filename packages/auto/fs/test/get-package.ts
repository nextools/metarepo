import test from 'blue-tape'
import { mock } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()
const vol = Volume.fromJSON({
  [`${rootDir}/package.json`]: JSON.stringify({
    name: '@ns/a',
    version: '1.0.0',
  }),
})
const fs = createFsFromVolume(vol)

test('fs:getPackage', async (t) => {
  const unmock = mock('../src/get-package', {
    'graceful-fs': fs,
  })

  const { getPackage } = await import('../src/get-package')
  t.deepEquals(
    await getPackage(rootDir),
    {
      name: '@ns/a',
      version: '1.0.0',
    },
    'should get package content'
  )

  unmock()
})

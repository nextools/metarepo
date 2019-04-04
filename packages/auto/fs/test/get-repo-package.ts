import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()
const vol = Volume.fromJSON({
  [`${rootDir}/package.json`]: JSON.stringify({
    name: '@ns/a',
    version: '1.0.0',
  }),
})
const fs = createFsFromVolume(vol)

test('fs:getRepoPackage', async (t) => {
  mock('../src/get-repo-package', {
    'graceful-fs': fs,
  })

  const { getRepoPackage } = await import('../src/get-repo-package')
  t.deepEquals(
    await getRepoPackage(),
    {
      name: '@ns/a',
      version: '1.0.0',
    },
    'should get package content'
  )

  unmock('../src/get-repo-package')
})

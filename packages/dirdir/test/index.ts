import path from 'path'
import { nanoid } from 'nanoid'
import { createRamDisk, deleteRamDisk } from 'ramdsk'
import test from 'tape'

test('dirdir: makeDir + result', async (t) => {
  const diskPath = await createRamDisk(nanoid(), 1024 * 512)
  const { makeDir } = await import('../src')
  const dirPath = path.join(diskPath, 'foo/bar/bar')
  const result = await makeDir(dirPath)

  t.equal(
    result,
    dirPath,
    'should return full path'
  )

  await deleteRamDisk(diskPath)
})

test('dirdir: makeDir + null', async (t) => {
  const diskPath = await createRamDisk(nanoid(), 1024 * 512)
  const { makeDir } = await import('../src')

  const result = await makeDir(diskPath)

  t.equal(
    result,
    null,
    'should return null'
  )

  await deleteRamDisk(diskPath)
})

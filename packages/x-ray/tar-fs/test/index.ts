/* eslint-disable no-sync */
import { promisify } from 'util'
import { readFile } from 'graceful-fs'
import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { Volume, createFsFromVolume } from 'memfs'

const pReadFile = promisify(readFile)

test('x-ray/next: TarFs', async (t) => {
  const fixtureData = await pReadFile(require.resolve('./fixtures/test.tar'))
  const vol = Volume.fromJSON({
    'fixtures/test.tar': fixtureData.toString(),
  })
  const fs = createFsFromVolume(vol)

  mock('../src', {
    fs,
    'graceful-fs': fs,
  })

  const { TarFs } = await import('../src')
  const tarFs = await TarFs('./fixtures/test.tar')

  t.true(
    tarFs.has('file-1.txt'),
    'has: should have file'
  )

  t.false(
    tarFs.has('file-3.txt'),
    'has: should not have file'
  )

  t.deepEqual(
    Array.from(tarFs.list()),
    ['file-1.txt', 'file-2.txt'],
    'list: should list files'
  )

  t.equal(
    tarFs.read('file-1.txt').toString(),
    'file-1',
    'read: should read file content'
  )

  try {
    tarFs.read('file-3.txt').toString()
    t.fail()
  } catch (e) {
    t.equal(
      e.message,
      'File file-3.txt doesn\'t exist',
      'read: should throw if file to read doesn\'t exist'
    )
  }

  tarFs.write('file-3.txt', {
    data: Buffer.from('file-3'),
    meta: {},
  })

  t.deepEqual(
    Array.from(tarFs.list()),
    ['file-1.txt', 'file-2.txt', 'file-3.txt'],
    'write: should add new file to a list of files'
  )

  t.equal(
    tarFs.read('file-3.txt').toString(),
    'file-3',
    'write: should write new file data'
  )

  await tarFs.save()

  const updatedTarFs = await TarFs('./fixtures/test.tar')

  t.deepEqual(
    Array.from(updatedTarFs.list()),
    ['file-1.txt', 'file-2.txt', 'file-3.txt'],
    'save: should write new file to a list of files'
  )

  t.equal(
    updatedTarFs.read('file-3.txt').toString(),
    'file-3',
    'save: should write new file data'
  )

  await updatedTarFs.save()

  t.deepEqual(
    Array.from(updatedTarFs.list()),
    ['file-1.txt', 'file-2.txt', 'file-3.txt'],
    'save: should write nothing if there were no changes'
  )

  const newTarFs = await TarFs('./fixtures/test2.tar')

  t.deepEqual(
    Array.from(newTarFs.list()),
    [],
    'TarFs: should create new TAR file'
  )

  fs.chmodSync('./fixtures/test.tar', fs.constants.S_IXUSR)

  try {
    await TarFs('./fixtures/test.tar')
    t.fail()
  } catch (e) {
    t.equal(
      e.code,
      'EACCES',
      'TarFs: should propagate stream errors'
    )
  }

  unmock('../src')
})

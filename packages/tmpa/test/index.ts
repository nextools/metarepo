/* eslint-disable node/no-sync */
import { mockFs } from '@mock/fs'
import { mockRequire } from '@mock/require'
import test from 'tape'

test('tmpa: getTempFilePath', async (t) => {
  const unmockRequire = mockRequire('../src', {
    os: {
      tmpdir: () => '/tmp/dir',
    },
    nanoid: {
      nanoid: (length: number) => Array.from({ length }).fill('A').join(''),
    },
  })
  const { fs, unmockFs } = mockFs('../src')

  fs.mkdirpSync('/tmp/real')
  fs.symlinkSync('/tmp/real', '/tmp/dir', 'dir')

  const { getTempFilePath } = await import('../src')

  const result = await getTempFilePath()

  t.equal(
    result,
    '/tmp/real/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'should work'
  )

  unmockRequire()
  unmockFs()
})

test('tmpa: getTempFilePath + extension', async (t) => {
  const unmockRequire = mockRequire('../src', {
    os: {
      tmpdir: () => '/tmp/dir',
    },
    nanoid: {
      nanoid: (length: number) => Array.from({ length }).fill('A').join(''),
    },
  })
  const { fs, unmockFs } = mockFs('../src')

  fs.mkdirpSync('/tmp/real')
  fs.symlinkSync('/tmp/real', '/tmp/dir', 'dir')

  const { getTempFilePath } = await import('../src')

  const result = await getTempFilePath('png')

  t.equal(
    result,
    '/tmp/real/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.png',
    'should work'
  )

  unmockRequire()
  unmockFs()
})

test('tmpa: getTempDirPath', async (t) => {
  const unmockRequire = mockRequire('../src', {
    os: {
      tmpdir: () => '/tmp/dir',
    },
    nanoid: {
      nanoid: (length: number) => Array.from({ length }).fill('A').join(''),
    },
  })
  const { fs, unmockFs } = mockFs('../src')

  fs.mkdirpSync('/tmp/real')
  fs.symlinkSync('/tmp/real', '/tmp/dir', 'dir')

  const { getTempDirPath } = await import('../src')

  const result = await getTempDirPath()

  t.equal(
    result,
    '/tmp/real/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'should work'
  )

  try {
    fs.accessSync(result)
    t.pass('should make dir')
  } catch {
    t.fail('should not get here')
  }

  unmockRequire()
  unmockFs()
})

test('tmpa: getTempDirPath + prefix', async (t) => {
  const unmockRequire = mockRequire('../src', {
    os: {
      tmpdir: () => '/tmp/dir',
    },
    nanoid: {
      nanoid: (length: number) => Array.from({ length }).fill('A').join(''),
    },
  })
  const { fs, unmockFs } = mockFs('../src')

  fs.mkdirpSync('/tmp/real')
  fs.symlinkSync('/tmp/real', '/tmp/dir', 'dir')

  const { getTempDirPath } = await import('../src')

  const result = await getTempDirPath('prefix-')

  t.equal(
    result,
    '/tmp/real/prefix-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'should work'
  )

  try {
    fs.accessSync(result)
    t.pass('should make dir')
  } catch {
    t.fail('should not get here')
  }

  unmockRequire()
  unmockFs()
})

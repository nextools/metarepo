/* eslint-disable node/no-sync */
import { mockFs } from '@mock/fs'
import { mockRequire } from '@mock/require'
import { createFsFromVolume, Volume } from 'memfs'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'

class CustomError extends Error {
  [key: string]: any

  constructor(props: { [key: string]: any }) {
    super(props.message)

    Object.keys(props).forEach((key) => {
      this[key] = props[key]
    })
  }
}

test('dleet: delete directory with subdirectories, files and symlinks', async (t) => {
  const { fs, unmockFs } = mockFs('../src/')

  fs.mkdirSync('/test/foo/bar/', { recursive: true })
  fs.writeFileSync('/test/1.md', '')
  fs.writeFileSync('/test/foo/2.md', '')
  fs.writeFileSync('/test/foo/bar/3.md', '')
  fs.symlinkSync('/test/foo/2.md', '/test/symlink')

  const { default: dleet } = await import('../src')

  await dleet('/test/')

  try {
    fs.accessSync('/test/')

    t.fail('should not get here')
  } catch {
    t.pass('should wipe everything')
  }

  unmockFs()
})

test('dleet: error: ENOENT + not win32', async (t) => {
  const { unmockFs } = mockFs('../src/')

  const { default: dleet } = await import('../src')

  await dleet('/test/2.md')

  t.pass('should ignore it')

  unmockFs()
})

test('dleet: error: ENOENT + win32', async (t) => {
  const originalPlatform = process.platform
  const { unmockFs } = mockFs('../src/')

  const { default: dleet } = await import('../src')

  Object.defineProperty(process, 'platform', {
    value: 'win32',
  })

  await dleet('/test/2.md')

  t.pass('should ignore it')

  Object.defineProperty(process, 'platform', {
    value: originalPlatform,
  })

  unmockFs()
})

test('dleet: error: EBUSY + win32 + 1 retry', async (t) => {
  const originalPlatform = process.platform

  const { fs, unmockFs } = mockFs('../src/')

  fs.mkdirSync('/test/')
  fs.writeFileSync('/test/1.md', '')

  const origLstat = fs.lstat

  const lstatSpy = createSpy(({ index, args }) => {
    if (index === 0) {
      throw new CustomError({ code: 'EBUSY' })
    }

    return origLstat(args[0], args[1])
  })

  fs.lstat = lstatSpy

  const sleepSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../src/', {
    sleap: {
      sleep: sleepSpy,
    },
  })

  Object.defineProperty(process, 'platform', {
    value: 'win32',
  })

  const { default: dleet } = await import('../src')

  await dleet('/test/1.md')

  t.deepEqual(
    getSpyCalls(lstatSpy).map((call) => [call[0]]),
    [['/test/1.md'], ['/test/1.md']],
    'should try 2 times'
  )

  t.deepEqual(
    getSpyCalls(sleepSpy),
    [[100]],
    'should wait 100ms'
  )

  try {
    fs.accessSync('/test/1.md')

    t.fail('should not get here')
  } catch {
    t.pass('should delete a file')
  }

  Object.defineProperty(process, 'platform', {
    value: originalPlatform,
  })

  unmockFs()
  unmockRequire()
})

test('dleet: error: EBUSY + win32 + 2 retries', async (t) => {
  const originalPlatform = process.platform
  const vol = Volume.fromJSON({
    '/test/1.md': '',
  })
  const fs = createFsFromVolume(vol)
  const lstatSpy = createSpy(({ index, args }) => {
    if (index < 2) {
      throw new CustomError({ code: 'EBUSY' })
    }

    return fs.lstat(args[0], args[1])
  })
  const sleepSpy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../src/', {
    fs: {
      ...fs,
      lstat: lstatSpy,
    },
    sleap: {
      sleep: sleepSpy,
    },
  })

  Object.defineProperty(process, 'platform', {
    value: 'win32',
  })

  const { default: dleet } = await import('../src')

  await dleet('/test/1.md')

  t.deepEqual(
    getSpyCalls(lstatSpy).map((call) => [call[0]]),
    [['/test/1.md'], ['/test/1.md'], ['/test/1.md']],
    'should try 3 times'
  )

  t.deepEqual(
    getSpyCalls(sleepSpy),
    [[100], [100]],
    'should wait for 100ms 2 times'
  )

  t.deepEqual(
    vol.toJSON(),
    { '/test': null },
    'should delete a file'
  )

  Object.defineProperty(process, 'platform', {
    value: originalPlatform,
  })

  unmockRequire()
  vol.reset()
})

test('dleet: error: EBUSY + win32 + 3 retries', async (t) => {
  const originalPlatform = process.platform
  const vol = Volume.fromJSON({
    '/test/1.md': '',
  })
  const fs = createFsFromVolume(vol)
  const lstatSpy = createSpy(() => {
    throw new CustomError({ code: 'EBUSY' })
  })

  const unmockRequire = mockRequire('../src/', {
    fs: {
      ...fs,
      lstat: lstatSpy,
    },
  })

  Object.defineProperty(process, 'platform', {
    value: 'win32',
  })

  const { default: dleet } = await import('../src')

  try {
    await dleet('/test/1.md')
  } catch (error) {
    t.deepEqual(
      getSpyCalls(lstatSpy).map((call) => [call[0]]),
      [['/test/1.md'], ['/test/1.md'], ['/test/1.md']],
      'should try 3 times'
    )

    t.equal(
      error.code,
      'EBUSY',
      'should throw an error'
    )
  }

  Object.defineProperty(process, 'platform', {
    value: originalPlatform,
  })

  unmockRequire()
  vol.reset()
})

test('dleet: error: EBUSY + not win32', async (t) => {
  const vol = Volume.fromJSON({
    '/test/1.md': '',
  })
  const fs = createFsFromVolume(vol)
  const lstatSpy = createSpy(() => {
    throw new CustomError({ code: 'EBUSY' })
  })

  const unmockRequire = mockRequire('../src/', {
    fs: {
      ...fs,
      lstat: lstatSpy,
    },
  })

  const { default: dleet } = await import('../src')

  try {
    await dleet('/test/1.md')
  } catch (error) {
    t.deepEqual(
      getSpyCalls(lstatSpy).map((call) => [call[0]]),
      [['/test/1.md']],
      'should try once'
    )

    t.equal(
      error.code,
      'EBUSY',
      'should throw an error'
    )
  }

  unmockRequire()
  vol.reset()
})

test('dleet: error: EPERM + win32 + fix + fixed', async (t) => {
  const originalPlatform = process.platform
  const vol = Volume.fromJSON({
    '/test/1.md': '',
  })
  const fs = createFsFromVolume(vol)
  const lstatSpy = createSpy(({ index, args }) => {
    if (index === 0) {
      throw new CustomError({ code: 'EPERM' })
    }

    return fs.lstat(args[0], args[1])
  })
  const chmodSpy = createSpy(({ args }) => {
    args[2](null)
  })

  const unmockRequire = mockRequire('../src/', {
    fs: {
      ...fs,
      chmod: chmodSpy,
      lstat: lstatSpy,
    },
  })

  Object.defineProperty(process, 'platform', {
    value: 'win32',
  })

  const { default: dleet } = await import('../src')

  await dleet('/test/1.md')

  t.deepEqual(
    getSpyCalls(lstatSpy).map((call) => [call[0]]),
    [['/test/1.md'], ['/test/1.md']],
    'should try 2 times'
  )

  t.deepEqual(
    getSpyCalls(chmodSpy).map((call) => [call[0], call[1]]),
    [['/test/1.md', 438]],
    'should apply chmod with value'
  )

  t.deepEqual(
    vol.toJSON(),
    { '/test': null },
    'should delete a file'
  )

  Object.defineProperty(process, 'platform', {
    value: originalPlatform,
  })

  unmockRequire()
  vol.reset()
})

test('dleet: error: EPERM + win32 + fix + not fixed', async (t) => {
  const originalPlatform = process.platform
  const vol = Volume.fromJSON({
    '/test/1.md': '',
  })
  const fs = createFsFromVolume(vol)
  const lstatSpy = createSpy(() => {
    throw new CustomError({ code: 'EPERM' })
  })

  const unmockRequire = mockRequire('../src/', {
    fs: {
      ...fs,
      lstat: lstatSpy,
    },
  })

  Object.defineProperty(process, 'platform', {
    value: 'win32',
  })

  const { default: dleet } = await import('../src')

  try {
    await dleet('/test/1.md')
  } catch (error) {
    t.deepEqual(
      getSpyCalls(lstatSpy).map((call) => [call[0]]),
      [['/test/1.md'], ['/test/1.md']],
      'should try 2 times'
    )

    t.equal(
      error.code,
      'EPERM',
      'should throw an error'
    )
  }

  Object.defineProperty(process, 'platform', {
    value: originalPlatform,
  })

  unmockRequire()
  vol.reset()
})

test('dleet: error: EPERM + not win32', async (t) => {
  const vol = Volume.fromJSON({
    '/test/1.md': '',
  })
  const fs = createFsFromVolume(vol)
  const lstatSpy = createSpy(() => {
    throw new CustomError({ code: 'EPERM' })
  })

  const unmockRequire = mockRequire('../src/', {
    fs: {
      ...fs,
      lstat: lstatSpy,
    },
  })

  const { default: dleet } = await import('../src')

  try {
    await dleet('/test/1.md')
  } catch (error) {
    t.deepEqual(
      getSpyCalls(lstatSpy).map((call) => [call[0]]),
      [['/test/1.md']],
      'should try once'
    )

    t.equal(
      error.code,
      'EPERM',
      'should throw an error'
    )
  }

  unmockRequire()
  vol.reset()
})

test('dleet: error: any other + not win32', async (t) => {
  const vol = Volume.fromJSON({
    '/test/1.md': '',
  })
  const fs = createFsFromVolume(vol)
  const lstatSpy = createSpy(() => {
    throw new CustomError({ code: 'OOPSIE' })
  })

  const unmockRequire = mockRequire('../src/', {
    fs: {
      ...fs,
      lstat: lstatSpy,
    },
  })

  const { default: dleet } = await import('../src')

  try {
    await dleet('/test/1.md')
  } catch (error) {
    t.deepEqual(
      getSpyCalls(lstatSpy).map((call) => [call[0]]),
      [['/test/1.md']],
      'should try once'
    )

    t.equal(
      error.code,
      'OOPSIE',
      'should throw an error'
    )
  }

  unmockRequire()
  vol.reset()
})

test('dleet: error: any other + win32', async (t) => {
  const originalPlatform = process.platform
  const vol = Volume.fromJSON({
    '/test/1.md': '',
  })
  const fs = createFsFromVolume(vol)
  const lstatSpy = createSpy(() => {
    throw new CustomError({ code: 'OOPSIE' })
  })

  const unmockRequire = mockRequire('../src/', {
    fs: {
      ...fs,
      lstat: lstatSpy,
    },
  })

  Object.defineProperty(process, 'platform', {
    value: 'win32',
  })

  const { default: dleet } = await import('../src')

  try {
    await dleet('/test/1.md')
  } catch (error) {
    t.deepEqual(
      getSpyCalls(lstatSpy).map((call) => [call[0]]),
      [['/test/1.md']],
      'should try once'
    )

    t.equal(
      error.code,
      'OOPSIE',
      'should throw an error'
    )
  }

  Object.defineProperty(process, 'platform', {
    value: originalPlatform,
  })

  unmockRequire()
  vol.reset()
})

/* eslint-disable no-sync */
import test from 'blue-tape'
import { createFsFromVolume, Volume } from 'memfs'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'

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
  const vol = Volume.fromJSON({
    '/test/1.md': '',
    '/test/foo/2.md': '',
    '/test/foo/bar/3.md': '',
  })
  const fs = createFsFromVolume(vol)

  fs.symlinkSync('/test/foo/2.md', '/test/symlink')

  mock('../src/', { fs })

  const { default: dleet } = await import('../src')

  await dleet('/test/')

  t.deepEqual(
    vol.toJSON(),
    {},
    'should wipe everything'
  )

  unmock('../src/')
  vol.reset()
})

test('dleet: error: ENOENT + win32', async (t) => {
  const vol = Volume.fromJSON({})
  const fs = createFsFromVolume(vol)

  mock('../src/', { fs })

  const { default: dleet } = await import('../src')

  await dleet('/test/2.md')

  t.deepEqual(
    vol.toJSON(),
    {},
    'should ignore it'
  )

  unmock('../src/')
  vol.reset()
})

test('dleet: error: ENOENT + not win32', async (t) => {
  const originalPlatform = process.platform
  const vol = Volume.fromJSON({})
  const fs = createFsFromVolume(vol)

  mock('../src/', { fs })

  const { default: dleet } = await import('../src')

  Object.defineProperty(process, 'platform', {
    value: 'win32',
  })

  await dleet('/test/2.md')

  t.deepEqual(
    vol.toJSON(),
    {},
    'should ignore it'
  )

  Object.defineProperty(process, 'platform', {
    value: originalPlatform,
  })

  unmock('../src/')
  vol.reset()
})

test('dleet: error: EBUSY + win32 + 1 retry', async (t) => {
  const originalPlatform = process.platform
  const vol = Volume.fromJSON({
    '/test/1.md': '',
  })
  const fs = createFsFromVolume(vol)
  const lstatSpy = createSpy(({ index, args }) => {
    if (index === 0) {
      throw new CustomError({ code: 'EBUSY' })
    }

    return fs.lstat(args[0], args[1])
  })
  const delaySpy = createSpy(() => Promise.resolve())

  mock('../src/', {
    fs: {
      ...fs,
      lstat: lstatSpy,
    },
    './delay': {
      delay: delaySpy,
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
    getSpyCalls(delaySpy),
    [[100]],
    'should wait 100ms'
  )

  t.deepEqual(
    vol.toJSON(),
    { '/test': null },
    'should delete a file'
  )

  Object.defineProperty(process, 'platform', {
    value: originalPlatform,
  })

  unmock('../src/')
  vol.reset()
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
  const delaySpy = createSpy(() => Promise.resolve())

  mock('../src/', {
    fs: {
      ...fs,
      lstat: lstatSpy,
    },
    './delay': {
      delay: delaySpy,
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
    getSpyCalls(delaySpy),
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

  unmock('../src/')
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

  mock('../src/', {
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

  unmock('../src/')
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

  mock('../src/', {
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

  unmock('../src/')
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

  mock('../src/', {
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

  unmock('../src/')
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

  mock('../src/', {
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

  unmock('../src/')
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

  mock('../src/', {
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

  unmock('../src/')
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

  mock('../src/', {
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

  unmock('../src/')
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

  mock('../src/', {
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

  unmock('../src/')
  vol.reset()
})

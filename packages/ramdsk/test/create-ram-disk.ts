import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'

test('ramdsk: createRamDisk + darwin', async (t) => {
  const spawnChildProcessSpy = createSpy(({ index }) => {
    if (index === 0) {
      return { stdout: '/dev/foo' }
    }
  })
  const unmockRequire = mockRequire('../src', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    process: {
      platform: 'darwin',
    },
  })

  const { createRamDisk } = await import('../src')
  const result = await createRamDisk('test', 1024 * 512)

  t.deepEqual(
    getSpyCalls(spawnChildProcessSpy),
    [
      ['hdiutil attach -nomount ram://1024'],
      ['diskutil erasevolume HFS+ "test" /dev/foo', { stdout: null }],
    ],
    'should spawn necessary commands'
  )

  t.equal(
    result,
    '/Volumes/test',
    'should return disk path'
  )

  unmockRequire()
})

test('ramdsk: createRamDisk + darwin + error', async (t) => {
  const spawnChildProcessSpy = createSpy(({ index }) => {
    if (index === 0) {
      return { stdout: '/dev/foo' }
    }

    throw new Error('oops')
  })
  const deleteRamDiskSpy = createSpy(() => {})
  const unmockRequire = mockRequire('../src', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    process: {
      platform: 'darwin',
    },
    '../src/delete-ram-disk': {
      deleteRamDisk: deleteRamDiskSpy,
    },
  })

  const { createRamDisk } = await import('../src')

  try {
    await createRamDisk('test', 1024 * 512)
  } catch (e) {
    t.deepEqual(
      getSpyCalls(deleteRamDiskSpy),
      [
        ['/dev/foo'],
      ],
      'should delete ram disk'
    )

    t.equal(
      e.message,
      'oops',
      'should throw'
    )
  }

  unmockRequire()
})

test('ramdsk: createRamDisk + linux', async (t) => {
  const spawnChildProcessSpy = createSpy(() => {})
  const unmockRequire = mockRequire('../src', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    process: {
      platform: 'linux',
    },
  })

  const { createRamDisk } = await import('../src')
  const result = await createRamDisk('test', 1024 * 512)

  t.deepEqual(
    getSpyCalls(spawnChildProcessSpy),
    [
      ['sudo mkdir "/mnt/test"', { stdout: null }],
      ['sudo mount --types tmpfs --options rw,size=524288 tmpfs "/mnt/test"', { stdout: null }],
    ],
    'should spawn necessary commands'
  )

  t.equal(
    result,
    '/mnt/test',
    'should return disk path'
  )

  unmockRequire()
})

test('ramdsk: createRamDisk + linux + error', async (t) => {
  const spawnChildProcessSpy = createSpy(() => {
    throw new Error('oops')
  })
  const deleteRamDiskSpy = createSpy(() => {})
  const unmockRequire = mockRequire('../src', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    process: {
      platform: 'linux',
    },
    '../src/delete-ram-disk': {
      deleteRamDisk: deleteRamDiskSpy,
    },
  })

  const { createRamDisk } = await import('../src')

  try {
    await createRamDisk('test', 1024 * 512)
  } catch (e) {
    t.deepEqual(
      getSpyCalls(deleteRamDiskSpy),
      [
        ['/mnt/test'],
      ],
      'should delete ram disk'
    )

    t.equal(
      e.message,
      'oops',
      'should throw'
    )
  }

  unmockRequire()
})

test('ramdsk: createRamDisk + unsupported platform', async (t) => {
  const unmockRequire = mockRequire('../src', {
    process: {
      platform: 'win32',
    },
  })

  const { createRamDisk } = await import('../src')

  try {
    await createRamDisk('test', 1024 * 512)
  } catch (e) {
    t.equal(
      e.message,
      'Platform "win32" is not supported',
      'should throw'
    )
  }

  unmockRequire()
})

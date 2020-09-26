import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'

test('ramdsk: deleteRamDisk + darwin', async (t) => {
  const spawnChildProcessSpy = createSpy(() => {})
  const unmockRequire = mockRequire('../src', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    process: {
      platform: 'darwin',
    },
  })

  const { deleteRamDisk } = await import('../src')

  await deleteRamDisk('/test')

  t.deepEqual(
    getSpyCalls(spawnChildProcessSpy),
    [
      ['hdiutil detach -force /test', { stdout: null }],
    ],
    'should spawn necessary commands'
  )

  unmockRequire()
})

test('ramdsk: deleteRamDisk + linux', async (t) => {
  const spawnChildProcessSpy = createSpy(() => {})

  const unmockRequire = mockRequire('../src', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
    process: {
      platform: 'linux',
    },
  })

  const { deleteRamDisk } = await import('../src')

  await deleteRamDisk('/test')

  t.deepEqual(
    getSpyCalls(spawnChildProcessSpy),
    [
      ['sudo unmount --force /test', { stdout: null }],
    ],
    'should spawn necessary commands'
  )

  unmockRequire()
})

test('ramdsk: deleteRamDisk + unsupported platform', async (t) => {
  const unmockRequire = mockRequire('../src', {
    process: {
      platform: 'win32',
    },
  })

  const { deleteRamDisk } = await import('../src')

  try {
    await deleteRamDisk('/test')
  } catch (e) {
    t.equal(
      e.message,
      'Platform "win32" is not supported',
      'should throw'
    )
  }

  unmockRequire()
})

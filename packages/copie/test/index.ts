/* eslint-disable no-sync */
import test from 'blue-tape'
import { createFsFromVolume, Volume } from 'memfs'
import { mock } from 'mocku'

test('copie: core', async (t) => {
  const vol = Volume.fromJSON({
    '/test/1.md': 'foo',
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../src/', { fs })

  const { default: copie } = await import('../src')

  await copie('/test/1.md', '/test/2.md')

  t.deepEqual(
    vol.toJSON(),
    {
      '/test/1.md': 'foo',
      '/test/2.md': 'foo',
    },
    'should copy file'
  )

  unmock()
  vol.reset()
})

test('copie: preserve stats', async (t) => {
  const vol = Volume.fromJSON({
    '/test/1.md': 'foo',
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../src/', { fs })

  const { default: copie } = await import('../src')

  await copie('/test/1.md', '/test/2.md')

  const stats1 = fs.lstatSync('/test/1.md')
  const stats2 = fs.lstatSync('/test/2.md')

  t.equal(
    stats1.uid.toString(),
    stats2.uid.toString(),
    'should preserve uid'
  )

  t.equal(
    stats1.gid.toString(),
    stats2.gid.toString(),
    'should preserve gid'
  )

  t.equal(
    stats1.mode.toString(),
    stats2.mode.toString(),
    'should preserve mode'
  )

  t.equal(
    stats1.atime.toString(),
    stats2.atime.toString(),
    'should preserve atime'
  )

  t.equal(
    stats1.mtime.toString(),
    stats2.mtime.toString(),
    'should preserve mtime'
  )

  unmock()
  vol.reset()
})

test('copie: read error', async (t) => {
  const vol = Volume.fromJSON({
    '/test/1.md': 'foo',
    '/test/dir/2.md': 'bar',
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../src/', { fs })

  const { default: copie } = await import('../src')

  try {
    await copie('/test/2.md', '/test/dir/2.md')
  } catch (error) {
    t.equal(
      error.code,
      'ENOENT',
      'should propagate error'
    )
  }

  unmock()
  vol.reset()
})

test('copie: write error', async (t) => {
  const vol = Volume.fromJSON({
    '/test/1.md': 'foo',
    '/test/dir/2.md': 'bar',
  })
  const fs = createFsFromVolume(vol)

  const unmock = mock('../src/', { fs })

  const { default: copie } = await import('../src')

  try {
    await copie('/test/1.md', '/test/dir/')
  } catch (error) {
    t.equal(
      error.code,
      'EISDIR',
      'should propagate error'
    )
  }

  unmock()
  vol.reset()
})

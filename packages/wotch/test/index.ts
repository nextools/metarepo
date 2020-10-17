import path from 'path'
import { nanoid } from 'nanoid'
import { writeFile } from 'pifs'
import { createRamDisk, deleteRamDisk } from 'ramdsk'
import test from 'tape'
import type { TWatchPathResult } from '../src'
import { watchPath } from '../src'

test('wotch: watchPath', async (t) => {
  const diskPath = await createRamDisk(nanoid(), 1024 * 512)
  const watcher = watchPath(diskPath)
  const results: TWatchPathResult[] = []
  const fooPath = path.join(diskPath, 'foo')

  for await (const result of watcher) {
    if (result.path.includes('.fseventsd')) {
      continue
    }

    results.push(result)

    if (result.event === 'addDir' && result.path === diskPath) {
      await writeFile(fooPath, '')
    }

    if (result.event === 'add' && result.path === fooPath) {
      break
    }
  }

  t.deepEqual(
    results,
    [
      { event: 'addDir', path: diskPath },
      { event: 'add', path: fooPath },
    ],
    'should work'
  )

  await deleteRamDisk(diskPath)
})

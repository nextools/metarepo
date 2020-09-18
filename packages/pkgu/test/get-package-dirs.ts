/* eslint-disable node/no-sync */
import path from 'path'
import { mockFs } from '@mock/fs'
import test from 'tape'

test('pkgu: getPackageDirs + `workspaces` as an array', async (t) => {
  const cwd = process.cwd()
  const { fs, unmockFs } = mockFs('../src')

  fs.mkdirpSync(path.join(cwd, 'packages/foo'))
  fs.mkdirpSync(path.join(cwd, 'packages/bar'))
  fs.mkdirpSync(path.join(cwd, 'packages/baz'))

  fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({
    workspaces: ['packages/*'],
  }))
  fs.writeFileSync(path.join(cwd, 'packages/foo/package.json'), JSON.stringify({
    name: 'foo',
    version: '1.0.0',
  }))
  fs.writeFileSync(path.join(cwd, 'packages/bar/package.json'), JSON.stringify({
    name: 'bar',
    version: '2.0.0',
  }))
  fs.writeFileSync(path.join(cwd, 'packages/baz/package.json'), JSON.stringify({
    name: 'baz',
    version: '3.0.0',
  }))

  const { getPackageDirs } = await import('../src')

  const result = await getPackageDirs()

  t.deepEqual(
    result,
    new Set([
      path.join(cwd, 'packages/bar'),
      path.join(cwd, 'packages/baz'),
      path.join(cwd, 'packages/foo'),
    ]),
    'should work'
  )

  unmockFs()
})

test('pkgu: getPackageDirs + `workspaces` as an object', async (t) => {
  const cwd = process.cwd()
  const { fs, unmockFs } = mockFs('../src')

  fs.mkdirpSync(path.join(cwd, 'packages/foo'))
  fs.mkdirpSync(path.join(cwd, 'packages/bar'))
  fs.mkdirpSync(path.join(cwd, 'packages/baz'))

  fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({
    workspaces: {
      packages: ['packages/*'],
    },
  }))
  fs.writeFileSync(path.join(cwd, 'packages/foo/package.json'), JSON.stringify({
    name: 'foo',
    version: '1.0.0',
  }))
  fs.writeFileSync(path.join(cwd, 'packages/bar/package.json'), JSON.stringify({
    name: 'bar',
    version: '2.0.0',
  }))
  fs.writeFileSync(path.join(cwd, 'packages/baz/package.json'), JSON.stringify({
    name: 'baz',
    version: '3.0.0',
  }))

  const { getPackageDirs } = await import('../src')

  const result = await getPackageDirs()

  t.deepEqual(
    result,
    new Set([
      path.join(cwd, 'packages/bar'),
      path.join(cwd, 'packages/baz'),
      path.join(cwd, 'packages/foo'),
    ]),
    'should work'
  )

  unmockFs()
})

test('pkgu: getPackageDirs + no `workspaces` error', async (t) => {
  const cwd = process.cwd()
  const { fs, unmockFs } = mockFs('../src')

  fs.mkdirpSync(cwd)

  fs.writeFileSync(path.join(cwd, 'package.json'), '{}')

  const { getPackageDirs } = await import('../src')

  try {
    await getPackageDirs()

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Cannot find `workspaces` field in the root `package.json`',
      'should throw'
    )
  }

  unmockFs()
})

test('pkgu: getPackageDirs + no `workspaces.packages` error', async (t) => {
  const cwd = process.cwd()
  const { fs, unmockFs } = mockFs('../src')

  fs.mkdirpSync(cwd)

  fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({
    workspaces: {},
  }))

  const { getPackageDirs } = await import('../src')

  try {
    await getPackageDirs()

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Cannot find `workspaces.packages` field in the root `package.json`',
      'should throw'
    )
  }

  unmockFs()
})

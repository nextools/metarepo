/* eslint-disable node/no-sync */
import path from 'path'
import { mockFs } from '@mock/fs'
import test from 'tape'

test('dupdep: getDuplicatedDependencies', async (t) => {
  const { fs, unmockFs } = mockFs('../src')
  const cwd = process.cwd()

  fs.mkdirpSync(path.join(cwd, 'packages/foo'))
  fs.mkdirpSync(path.join(cwd, 'packages/bar'))
  fs.mkdirpSync(path.join(cwd, 'packages/baz'))
  fs.mkdirpSync(path.join(cwd, 'packages/qux'))

  fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({
    workspaces: ['packages/*'],
  }))

  fs.writeFileSync(path.join(cwd, 'packages/foo/package.json'), JSON.stringify({
    name: 'foo',
    dependencies: {
      dep2: '^2.0.0',
    },
    devDependencies: {
      dep1: '^1.0.0',
    },
  }))

  fs.writeFileSync(path.join(cwd, 'packages/bar/package.json'), JSON.stringify({
    name: 'bar',
    dependencies: {
      dep1: '^2.0.0',
    },
    devDependencies: {
      dep2: '^3.0.0',
    },
  }))

  fs.writeFileSync(path.join(cwd, 'packages/baz/package.json'), JSON.stringify({
    name: 'baz',
    dependencies: {
      dep1: '^1.5.0',
      dep2: '^2.5.0',
    },
  }))

  fs.writeFileSync(path.join(cwd, 'packages/qux/package.json'), JSON.stringify({
    name: 'qux',
  }))

  const { getDuplicatedDependencies } = await import('../src')
  const result = await getDuplicatedDependencies()

  t.deepEqual(
    result,
    new Map([
      ['bar', new Map([
        ['dep1', {
          range: '^2.0.0',
          dependents: new Set([
            { pkgName: 'baz', range: '^1.5.0' },
            { pkgName: 'foo', range: '^1.0.0' },
          ]),
        }],
        ['dep2', {
          range: '^3.0.0',
          dependents: new Set([
            { pkgName: 'baz', range: '^2.5.0' },
            { pkgName: 'foo', range: '^2.0.0' },
          ]),
        }],
      ])],
      ['baz', new Map([
        ['dep1', {
          range: '^1.5.0',
          dependents: new Set([
            { pkgName: 'bar', range: '^2.0.0' },
          ]),
        }],
        ['dep2', {
          range: '^2.5.0',
          dependents: new Set([
            { pkgName: 'bar', range: '^3.0.0' },
          ]),
        }],
      ])],
      ['foo', new Map([
        ['dep1', {
          range: '^1.0.0',
          dependents: new Set([
            { pkgName: 'bar', range: '^2.0.0' },
          ]),
        }],
        ['dep2', {
          range: '^2.0.0',
          dependents: new Set([
            { pkgName: 'bar', range: '^3.0.0' },
          ]),
        }],
      ])],
    ]),
    'should work'
  )

  unmockFs()
})

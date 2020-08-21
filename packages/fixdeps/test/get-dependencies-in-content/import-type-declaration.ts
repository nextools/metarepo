import test from 'tape'
import { getDependenciesInContent } from '../../src/get-dependencies-in-content'

test('fixdeps: import type declaration: package dependency', (t) => {
  const content = `
  import type { path } from 'path'
  import type { fs } from 'fs'
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['path', 'fs'],
    'should find import'
  )

  t.end()
})

test('fixdeps: import type declaration: package with path', (t) => {
  const content = `
  import type { func } from 'pkg/path/to/file'
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should find package name'
  )

  t.end()
})

test('fixdeps: import type declaration: scoped package', (t) => {
  const content = `
  import type { func1 } from '@scope/pkg'
  import type { func2 } from '@ns/my-package/path/to/file'
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    [
      '@scope/pkg',
      '@ns/my-package',
    ],
    'should find scoped packages'
  )

  t.end()
})

test('fixdeps: import type declaration: relative path', (t) => {
  const content = `
  import type { func1 } from '../src/path/to/file'
  import type { func2 } from './file'
  import type { func3 } from 'pkg'
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should skip relative paths'
  )

  t.end()
})

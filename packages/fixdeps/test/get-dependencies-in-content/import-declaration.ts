import test from 'blue-tape'
import { getDependenciesInContent } from '../../src/get-dependencies-in-content'

test('fixdeps: import declaration: package dependency', (t) => {
  const content = `
  import path from 'path'
  import fs from 'fs'
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['path', 'fs'],
    'should find import'
  )

  t.end()
})

test('fixdeps: import declaration: package with path', (t) => {
  const content = `
  import { func } from 'pkg/path/to/file'
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should find package name'
  )

  t.end()
})

test('fixdeps: import declaration: scoped package', (t) => {
  const content = `
  import { func1 } from '@scope/pkg'
  import { func2 } from '@ns/my-package/path/to/file'
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

test('fixdeps: import declaration: relative path', (t) => {
  const content = `
  import { func1 } from '../src/path/to/file'
  import { func2 } from './file'
  import { func3 } from 'pkg'
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should skip relative paths'
  )

  t.end()
})

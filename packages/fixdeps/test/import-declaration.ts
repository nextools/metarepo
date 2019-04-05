import test from 'blue-tape'
import { getDependenciesInContent } from '../src/get-dependencies-in-content'

test('import declaration: package dependency', async (t) => {
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
})

test('import declaration: package with path', async (t) => {
  const content = `
  import { func } from 'pkg/path/to/file'
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should find package name'
  )
})

test('import declaration: scoped package', async (t) => {
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
})

test('import declaration: relative path', async (t) => {
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
})

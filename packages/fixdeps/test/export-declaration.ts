import test from 'blue-tape'
import { getDependenciesInContent } from '../src/get-dependencies-in-content'

test('export declaration: package dependency', async (t) => {
  const content = `
  export { default as path } from 'path'
  export * from 'fs'
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['path', 'fs'],
    'should find dependencies'
  )
})

test('export declaration: package with path', async (t) => {
  const content = `
  export { func } from 'pkg/path/to/file'
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should find package name'
  )
})

test('export declaration: scoped package', async (t) => {
  const content = `
  export { func1 } from '@scope/pkg'
  export { func2 } from '@ns/my-package/path/to/file'
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

test('export declaration: relative path', async (t) => {
  const content = `
  export { func1 } from '../src/path/to/file'
  export { func2 } from './file'
  export { func3 } from 'pkg'
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should skip relative paths'
  )
})

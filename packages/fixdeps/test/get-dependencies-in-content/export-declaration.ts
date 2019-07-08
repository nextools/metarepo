import test from 'blue-tape'
import { getDependenciesInContent } from '../../src/get-dependencies-in-content'

test('fixdeps: export declaration: package dependency', (t) => {
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

  t.end()
})

test('fixdeps: export declaration: package with path', (t) => {
  const content = `
  export { func } from 'pkg/path/to/file'
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should find package name'
  )

  t.end()
})

test('fixdeps: export declaration: scoped package', (t) => {
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

  t.end()
})

test('fixdeps: export declaration: relative path', (t) => {
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

  t.end()
})

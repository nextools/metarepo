import test from 'blue-tape'
import { getDependenciesInContent } from '../../src/get-dependencies-in-content'

test('fixdeps: require-expression: package dependency', (t) => {
  const content = `
  const path = require.resolve('path')
  const fs = require.resolve('fs')
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['path', 'fs'],
    'should find required packages'
  )

  t.end()
})

test('fixdeps: require-expression: package with path', (t) => {
  const content = `
  const { func } = require.resolve('pkg/path/to/file')
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should find package name'
  )

  t.end()
})

test('fixdeps: require-expression: scoped package', (t) => {
  const content = `
  const { func1 } = require.resolve('@scope/pkg')
  const { func2 } = require.resolve('@ns/my-package/path/to/file')
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

test('fixdeps: require-expression: relative paths', (t) => {
  const content = `
  const { func1 } = require.resolve('../src/path/to/file')
  const { func2 } = require.resolve('./file')
  const { func3 } = require.resolve('pkg')
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should skip relative paths'
  )

  t.end()
})

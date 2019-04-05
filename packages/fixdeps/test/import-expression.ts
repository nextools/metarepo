import test from 'blue-tape'
import { getDependenciesInContent } from '../src/get-dependencies-in-content'

test('import expression: package dependency', async (t) => {
  const content = `
  async () => {
    const { default: path } = await import('path')
    const { default: fs } = await import('fs')
  }
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['path', 'fs'],
    'should find import'
  )
})

test('import expression: package with path', async (t) => {
  const content = `
  async () => {
    const { func } = await import('pkg/path/to/file')
  }
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should find package name'
  )
})

test('import expression: scoped package', async (t) => {
  const content = `
  async () => {
    const { func1 } = await import('@scope/pkg')
    const { func2 } = await import('@ns/my-package/path/to/file')
  }
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

test('import expression: relative path', async (t) => {
  const content = `
  async () => {
    const { func1 } = await import('../src/path/to/file')
    const { func2 } = awaitimport('./file')
    const { func3 } = await import('pkg')
  }
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should skip relative paths'
  )
})

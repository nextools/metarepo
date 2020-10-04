import test from 'tape'
import { joinPath, matchGlobs } from './helpers'

// 'packages/dl?et/**/*.md',
// 'packages/copie/**/*.ts',
// 'packages/pkgu',
// 'packages/perf?/web',
// 'packages/sdfshdfhsjdf',
// 'packages/sdfshdfhsjdf/*',
// '!**/readme.md',
// '!packages/copie/test/*.ts',

test('iva: matchGlobs + glob as existing dir path', async (t) => {
  const { accessCalls, readdirCalls, result } = await matchGlobs(['packages/foo'])

  t.deepEqual(
    accessCalls,
    [joinPath('packages/foo')],
    'access'
  )

  t.deepEqual(
    readdirCalls,
    [],
    'readdir'
  )

  t.deepEqual(
    result,
    [joinPath('packages/foo')],
    'result'
  )
})

test('iva: matchGlobs + glob as existing dir path + negation', async (t) => {
  const { accessCalls, readdirCalls, result } = await matchGlobs([
    'packages/foo',
    '!packages/foo',
  ])

  t.deepEqual(
    accessCalls,
    [],
    'access'
  )

  t.deepEqual(
    readdirCalls,
    [],
    'readdir'
  )

  t.deepEqual(
    result,
    [],
    'result'
  )
})

test('iva: matchGlobs + glob as existing file path', async (t) => {
  const { accessCalls, readdirCalls, result } = await matchGlobs(['packages/foo/readme.md'])

  t.deepEqual(
    accessCalls,
    [joinPath('packages/foo/readme.md')],
    'access'
  )

  t.deepEqual(
    readdirCalls,
    [],
    'readdir'
  )

  t.deepEqual(
    result,
    [joinPath('packages/foo/readme.md')],
    'result'
  )
})

test('iva: matchGlobs + glob as existing file path + negation', async (t) => {
  const { accessCalls, readdirCalls, result } = await matchGlobs([
    'packages/foo/readme.md',
    '!packages/foo/*',
  ])

  t.deepEqual(
    accessCalls,
    [],
    'access'
  )

  t.deepEqual(
    readdirCalls,
    [],
    'readdir'
  )

  t.deepEqual(
    result,
    [],
    'result'
  )
})

test('iva: matchGlobs + glob as non-existing path', async (t) => {
  const { accessCalls, readdirCalls, result } = await matchGlobs(['packages/non-existing'])

  t.deepEqual(
    accessCalls,
    [joinPath('packages/non-existing')],
    'access'
  )

  t.deepEqual(
    readdirCalls,
    [],
    'readdir'
  )

  t.deepEqual(
    result,
    [],
    'result'
  )
})

test('iva: matchGlobs + glob as non-existing path + negation', async (t) => {
  const { accessCalls, readdirCalls, result } = await matchGlobs([
    'packages/non-existing',
    '!packages/non-existing',
  ])

  t.deepEqual(
    accessCalls,
    [],
    'access'
  )

  t.deepEqual(
    readdirCalls,
    [],
    'readdir'
  )

  t.deepEqual(
    result,
    [],
    'result'
  )
})

test('iva: matchGlobs + glob as non-existing path + non-existing negation', async (t) => {
  const { accessCalls, readdirCalls, result } = await matchGlobs([
    'packages/non-existing',
    '!packages/non-existing-2',
  ])

  t.deepEqual(
    accessCalls,
    [joinPath('packages/non-existing')],
    'access'
  )

  t.deepEqual(
    readdirCalls,
    [],
    'readdir'
  )

  t.deepEqual(
    result,
    [],
    'result'
  )
})

test('iva: matchGlobs + path + glob + glob', async (t) => {
  const { accessCalls, readdirCalls, result } = await matchGlobs(['packages/ba?/*.md'])

  t.deepEqual(
    accessCalls,
    [],
    'access'
  )

  t.deepEqual(
    readdirCalls,
    [
      joinPath('packages'),
      joinPath('packages/bar'),
      joinPath('packages/baz'),
    ],
    'readdir'
  )

  t.deepEqual(
    result,
    [
      joinPath('packages/bar/license.md'),
      joinPath('packages/bar/readme.md'),
      joinPath('packages/baz/readme.md'),
    ],
    'result'
  )
})

test('iva: matchGlobs + path + glob + glob + negations', async (t) => {
  const { accessCalls, readdirCalls, result } = await matchGlobs([
    'packages/ba?/*.md',
    '!**/bar/readme.md',
    '!**/baz/readme.md',
  ])

  t.deepEqual(
    accessCalls,
    [],
    'access'
  )

  t.deepEqual(
    readdirCalls,
    [
      joinPath('packages'),
      joinPath('packages/bar'),
      joinPath('packages/baz'),
    ],
    'readdir'
  )

  t.deepEqual(
    result,
    [
      joinPath('packages/bar/license.md'),
    ],
    'result'
  )
})

test('iva: matchGlobs + path + glob + path + glob', async (t) => {
  const { accessCalls, readdirCalls, result } = await matchGlobs(['packages/ba?/src/*.ts'])

  t.deepEqual(
    accessCalls,
    [],
    'access'
  )

  t.deepEqual(
    readdirCalls,
    [
      joinPath('packages'),
      joinPath('packages/bar/src'),
      joinPath('packages/baz/src'),
    ],
    'readdir'
  )

  t.deepEqual(
    result,
    [
      joinPath('packages/bar/src/index.ts'),
      joinPath('packages/baz/src/index.ts'),
    ],
    'result'
  )
})

test('iva: matchGlobs + path + glob + path + glob + negations', async (t) => {
  const { accessCalls, readdirCalls, result } = await matchGlobs([
    'packages/ba?/src/*.ts',
    '!packages/bar/**/*',
  ])

  t.deepEqual(
    accessCalls,
    [],
    'access'
  )

  t.deepEqual(
    readdirCalls,
    [
      joinPath('packages'),
      joinPath('packages/baz/src'),
    ],
    'readdir'
  )

  t.deepEqual(
    result,
    [
      joinPath('packages/baz/src/index.ts'),
    ],
    'result'
  )
})

test('iva: matchGlobs + path + infinite depth glob + path + glob', async (t) => {
  const { accessCalls, readdirCalls, result } = await matchGlobs(['packages/**/src/*.ts'])

  t.deepEqual(
    accessCalls,
    [],
    'access'
  )

  t.deepEqual(
    readdirCalls,
    [
      joinPath('packages'),
      joinPath('packages/bar'),
      joinPath('packages/bar/src'),
      joinPath('packages/bar/test'),
      joinPath('packages/baz'),
      joinPath('packages/baz/src'),
      joinPath('packages/baz/test'),
      joinPath('packages/foo'),
      joinPath('packages/foo/src'),
      joinPath('packages/foo/test'),
    ],
    'readdir'
  )

  t.deepEqual(
    result,
    [
      joinPath('packages/bar/src/index.ts'),
      joinPath('packages/baz/src/index.ts'),
      joinPath('packages/foo/src/index.ts'),
    ],
    'result'
  )
})

test('iva: matchGlobs + path + infinite depth glob + path + glob + negations', async (t) => {
  const { accessCalls, readdirCalls, result } = await matchGlobs([
    'packages/**/src/*.ts',
    '!packages/bar/**/*',
    '!packages/baz/**/*',
  ])

  t.deepEqual(
    accessCalls,
    [],
    'access'
  )

  t.deepEqual(
    readdirCalls,
    [
      joinPath('packages'),
      joinPath('packages/bar'),
      joinPath('packages/baz'),
      joinPath('packages/foo'),
      joinPath('packages/foo/src'),
      joinPath('packages/foo/test'),
    ],
    'readdir'
  )

  t.deepEqual(
    result,
    [
      joinPath('packages/foo/src/index.ts'),
    ],
    'result'
  )
})

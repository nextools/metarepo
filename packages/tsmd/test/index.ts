import test from 'tape'
import { tsToMd } from '../src'

test('tsmd: arrow function + description + tags', async (t) => {
  const fixturePath = require.resolve('./fixtures/arrow-function/description-tags.ts')
  const result = await tsToMd(fixturePath)

  t.deepEqual(
    result,
    [
      {
        type: 'arrow-function',
        source: 'const getAverage: (x: number, y: number) => number',
        doc: {
          description: 'Description line 1.\nDescription line 2.',
          tags: [
            { tag: 'remarks', description: 'Remarks line 1.\nRemarks line 2.' },
            { tag: 'param', name: 'x', description: 'first param description' },
            { tag: 'param', name: 'y', description: 'second param description' },
            { tag: 'returns', description: 'return description' },
            { tag: 'label' },
          ],
        },
      },
    ],
    'should work'
  )
})

test('tsmd: arrow function + description', async (t) => {
  const fixturePath = require.resolve('./fixtures/arrow-function/description.ts')
  const result = await tsToMd(fixturePath)

  t.deepEqual(
    result,
    [
      {
        type: 'arrow-function',
        source: 'const getAverage: (x: number, y: number) => number',
        doc: {
          description: 'Description line 1.\nDescription line 2.',
        },
      },
    ],
    'should work'
  )
})

test('tsmd: arrow function + tags', async (t) => {
  const fixturePath = require.resolve('./fixtures/arrow-function/tags.ts')
  const result = await tsToMd(fixturePath)

  t.deepEqual(
    result,
    [
      {
        type: 'arrow-function',
        source: 'const getAverage: (x: number, y: number) => number',
        doc: {
          tags: [
            { tag: 'remarks', description: 'Remarks line 1.\nRemarks line 2.' },
            { tag: 'param', name: 'x', description: 'first param description' },
            { tag: 'param', name: 'y', description: 'second param description' },
            { tag: 'returns', description: 'return description' },
            { tag: 'label' },
          ],
        },
      },
    ],
    'should work'
  )
})

test('tsmd: arrow function + no return type', async (t) => {
  const fixturePath = require.resolve('./fixtures/arrow-function/no-return-type.ts')
  const result = await tsToMd(fixturePath)

  t.deepEqual(
    result,
    [
      {
        type: 'arrow-function',
        source: 'const getAverage: (x: number, y: number) => unknown',
        doc: {
          description: 'Description line 1.\nDescription line 2.',
        },
      },
    ],
    'should work'
  )
})

test('tsmd: arrow function + no doc', async (t) => {
  const fixturePath = require.resolve('./fixtures/arrow-function/no-doc.ts')
  const result = await tsToMd(fixturePath)

  t.deepEqual(
    result,
    [],
    'should return empty result'
  )
})

test('tsmd: var but not arrow function', async (t) => {
  const fixturePath = require.resolve('./fixtures/arrow-function/var-but-not-arrow-function.ts')
  const result = await tsToMd(fixturePath)

  t.deepEqual(
    result,
    [],
    'should return empty result'
  )
})

test('tsmd: type alias + description', async (t) => {
  const fixturePath = require.resolve('./fixtures/type-alias/description.ts')
  const result = await tsToMd(fixturePath)

  t.deepEqual(
    result,
    [
      {
        type: 'type-alias',
        source: 'type TTest = {\n  foo: string,\n  bar: number,\n}',
        doc: {
          description: 'Description line 1.\nDescription line 2.',
        },
      },
    ],
    'should work'
  )
})

test('tsmd: type alias + description + tags', async (t) => {
  const fixturePath = require.resolve('./fixtures/type-alias/description-tags.ts')
  const result = await tsToMd(fixturePath)

  t.deepEqual(
    result,
    [
      {
        type: 'type-alias',
        source: 'type TTest = {\n  foo: string,\n  bar: number,\n}',
        doc: {
          description: 'Description line 1.\nDescription line 2.',
          tags: [
            { tag: 'remarks', description: 'Remarks line 1.\nRemarks line 2.' },
            { tag: 'see', description: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
            { tag: 'label' },
          ],
        },
      },
    ],
    'should work'
  )
})

test('tsmd: type alias + description + inline', async (t) => {
  const fixturePath = require.resolve('./fixtures/type-alias/description-inline.ts')
  const result = await tsToMd(fixturePath)

  t.deepEqual(
    result,
    [
      {
        type: 'type-alias',
        source: 'type TTest = {\n  /** inline description */\n  foo: string,\n  bar: number,\n}',
        doc: {
          description: 'Description line 1.\nDescription line 2.',
        },
      },
    ],
    'should work'
  )
})

test('tsmd: type alias + inline', async (t) => {
  const fixturePath = require.resolve('./fixtures/type-alias/inline.ts')
  const result = await tsToMd(fixturePath)

  t.deepEqual(
    result,
    [
      {
        type: 'type-alias',
        source: 'type TTest = {\n  /** inline description */\n  foo: string,\n  bar: number,\n}',
      },
    ],
    'should work'
  )
})

test('tsmd: type alias + no doc', async (t) => {
  const fixturePath = require.resolve('./fixtures/type-alias/no-doc.ts')
  const result = await tsToMd(fixturePath)

  t.deepEqual(
    result,
    [],
    'should return empty result'
  )
})

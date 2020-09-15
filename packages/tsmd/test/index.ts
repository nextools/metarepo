import test from 'tape'
import { tsToMd } from '../src'

test('tsmd: tsToMd + arrow function + no doc', async (t) => {
  const fixturePath = require.resolve('./fixtures/arrow-function/no-doc.ts')
  const result = await tsToMd(fixturePath)

  t.deepEqual(
    result,
    [],
    'should work'
  )
})

test('tsmd: tsToMd + arrow function + description + tags', async (t) => {
  const fixturePath = require.resolve('./fixtures/arrow-function/description-tags.ts')
  const result = await tsToMd(fixturePath)

  t.deepEqual(
    result,
    [
      {
        type: 'arrow-function',
        source: 'const getAverage: (x: number, y: number) => number',
        doc: {
          description: 'Returns the average of two numbers.',
          tags: [
            { tag: 'remarks', description: 'This method is part of the blah-blah.' },
            { tag: 'param', name: 'x', description: 'The first input number' },
            { tag: 'param', name: 'y', description: 'The second input number' },
            { tag: 'returns', description: 'The arithmetic mean of x and y' },
            { tag: 'beta' },
          ],
        },
      },
    ],
    'should work'
  )
})

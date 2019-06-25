import test from 'blue-tape'
import { prefixes } from '@auto/utils/test/prefixes'
import { getMarkdownLog } from '../src/get-markdown-log'

test('getMarkdownLog', (t) => {
  t.deepEquals(
    getMarkdownLog(
      [
        {
          name: 'a',
          version: '0.1.2',
          type: 'minor',
          dir: 'dir',
          messages: [
            {
              type: 'minor',
              value: 'minor',
            },
            {
              type: 'patch',
              value: 'patch',
            },
          ],
        },
        {
          name: 'b',
          version: '1.2.3',
          type: 'minor',
          dir: 'dir',
          messages: [
            {
              type: 'minor',
              value: 'minor',
            },
            {
              type: 'patch',
              value: 'patch',
            },
          ],
        },
      ],
      prefixes
    ),
    '## a v0.1.2\n\n* 🌱 minor\n* 🐞 patch\n\n## b v1.2.3\n\n* 🌱 minor\n* 🐞 patch\n',
    'should get markdown'
  )

  t.end()
})
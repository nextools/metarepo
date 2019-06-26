import test from 'blue-tape'
import { TGitBump } from '@auto/utils/src/types'
import { getLog } from '../src/get-log'
import { TLog } from '../src/types'

test('getLog', (t) => {
  t.deepEquals(
    getLog(
      [
        {
          name: 'a',
          dir: 'fakes/a',
          version: null,
          type: null,
          deps: null,
          devDeps: {
            b: '1.2.3',
          },
        },
      ],
      [
        {
          name: 'b',
          type: 'patch',
          messages: [],
        },
      ]
    ),
    [],
    'devDeps: should return empty array'
  )

  t.deepEquals(
    getLog(
      [
        {
          name: 'a',
          dir: 'fakes/a',
          version: '1.2.3',
          type: 'patch',
          deps: {
            b: '1.2.3',
            c: '1.2.3',
          },
          devDeps: null,
        },
      ],
      [
        {
          name: 'b',
          type: 'patch',
          messages: [],
        },
      ]
    ),
    [
      {
        name: 'a',
        version: '1.2.3',
        type: 'patch',
        dir: 'fakes/a',
        messages: [
          {
            type: 'dependencies',
            value: 'upgrade dependencies: `b`, `c`',
          },
        ],
      },
    ] as TLog[],
    'deps only: should return dependency upgrade message'
  )

  t.deepEquals(
    getLog(
      [
        {
          name: 'a',
          dir: 'fakes/a',
          version: '1.2.3',
          type: 'patch',
          deps: null,
          devDeps: null,
        },
      ],
      [] as TGitBump[]
    ),
    [],
    'skip incorrect case in results'
  )

  t.deepEquals(
    getLog(
      [
        {
          name: 'a',
          dir: 'fakes/a',
          version: '1.2.3',
          type: 'patch',
          deps: {
            b: '1.2.3',
            c: '1.2.3',
          },
          devDeps: null,
        },
      ],
      [
        {
          name: 'a',
          type: 'patch',
          messages: [
            {
              type: 'minor',
              value: 'minor',
            },
            {
              type: 'patch',
              value: 'patch',
            },
            {
              type: 'major',
              value: 'major',
            },
          ],
        },
      ]
    ),
    [
      {
        name: 'a',
        version: '1.2.3',
        type: 'patch',
        dir: 'fakes/a',
        messages: [
          {
            type: 'major',
            value: 'major',
          },
          {
            type: 'minor',
            value: 'minor',
          },
          {
            type: 'patch',
            value: 'patch',
          },
          {
            type: 'dependencies',
            value: 'upgrade dependencies: `b`, `c`',
          },
        ],
      },
    ] as TLog[],
    'deps with messages: should return sorted messages with dependency upgrade message'
  )

  t.deepEquals(
    getLog(
      [
        {
          name: 'a',
          dir: 'fakes/a',
          version: '1.2.3',
          type: 'major',
          deps: null,
          devDeps: null,
        },
      ],
      [
        {
          name: 'a',
          type: 'major',
          messages: [
            {
              type: 'minor',
              value: 'minor',
            },
            {
              type: 'patch',
              value: 'patch',
            },
            {
              type: 'major',
              value: 'major',
            },
          ],
        },
      ]
    ),
    [
      {
        name: 'a',
        version: '1.2.3',
        type: 'major',
        dir: 'fakes/a',
        messages: [
          {
            type: 'major',
            value: 'major',
          },
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
    ] as TLog[],
    'messages only: should return sorted messages'
  )

  t.deepEquals(
    getLog(
      [
        {
          name: 'a',
          dir: 'fakes/a',
          version: '1.2.3',
          type: 'major',
          deps: null,
          devDeps: null,
        },
      ],
      [
        {
          name: 'a',
          type: 'major',
          messages: [
            {
              type: 'minor',
              value: 'minor',
            },
            {
              type: 'initial',
              value: 'initial',
            },
            {
              type: 'major',
              value: 'major',
            },
          ],
        },
      ]
    ),
    [
      {
        name: 'a',
        version: '1.2.3',
        type: 'major',
        dir: 'fakes/a',
        messages: [
          {
            type: 'initial',
            value: 'initial',
          },
          {
            type: 'major',
            value: 'major',
          },
          {
            type: 'minor',
            value: 'minor',
          },
        ],
      },
    ] as TLog[],
    'messages only: should return sorted messages'
  )

  t.end()
})

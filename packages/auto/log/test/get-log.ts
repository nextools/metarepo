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
            value: 'update dependencies: `b`, `c`',
          },
        ],
      },
    ] as TLog[],
    'deps only: should return dependency update message'
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
              description: 'minor',
            },
            {
              type: 'patch',
              value: 'patch',
              description: 'patch',
            },
            {
              type: 'major',
              value: 'major',
              description: 'major',
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
            description: 'major',
          },
          {
            type: 'minor',
            value: 'minor',
            description: 'minor',
          },
          {
            type: 'patch',
            value: 'patch',
            description: 'patch',
          },
          {
            type: 'dependencies',
            value: 'update dependencies: `b`, `c`',
          },
        ],
      },
    ] as TLog[],
    'deps with messages: should return sorted messages with dependency update message'
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
              description: 'minor',
            },
            {
              type: 'patch',
              value: 'patch',
              description: 'patch',
            },
            {
              type: 'major',
              value: 'major',
              description: 'major',
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
            description: 'major',
          },
          {
            type: 'minor',
            value: 'minor',
            description: 'minor',
          },
          {
            type: 'patch',
            value: 'patch',
            description: 'patch',
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
          type: 'minor',
          deps: {
            b: '1.2.3',
          },
          devDeps: null,
        },
      ],
      [
        {
          name: 'a',
          type: 'minor',
          messages: [
            {
              type: 'patch',
              value: 'patch',
              description: 'patch',
            },
            {
              type: 'initial',
              value: 'initial',
              description: 'initial',
            },
            {
              type: 'minor',
              value: 'minor',
              description: 'minor',
            },
          ],
        },
      ]
    ),
    [
      {
        name: 'a',
        version: '1.2.3',
        type: 'minor',
        dir: 'fakes/a',
        messages: [
          {
            type: 'initial',
            value: 'initial',
            description: 'initial',
          },
        ],
      },
    ] as TLog[],
    'initial: should skip dependency update message'
  )

  t.end()
})

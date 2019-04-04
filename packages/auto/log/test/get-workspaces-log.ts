import test from 'blue-tape'
import { TWorkspacesGitBump } from '@auto/utils/src/types'
import { getWorkspacesLog } from '../src/get-workspaces-log'
import { TWorkspacesLog } from '../src/types'

test('getWorkspacesLog', (t) => {
  t.deepEquals(
    getWorkspacesLog(
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
    getWorkspacesLog(
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
        messages: [
          {
            type: 'dependencies',
            value: 'upgrade dependencies',
          },
        ],
      },
    ] as TWorkspacesLog[],
    'deps only: should return dependency upgrade message'
  )

  t.deepEquals(
    getWorkspacesLog(
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
      [] as TWorkspacesGitBump[]
    ),
    [],
    'skip incorrect case in results'
  )

  t.deepEquals(
    getWorkspacesLog(
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
            value: 'upgrade dependencies',
          },
        ],
      },
    ] as TWorkspacesLog[],
    'deps with messages: should return sorted messages with dependency upgrade message'
  )

  t.deepEquals(
    getWorkspacesLog(
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
    ] as TWorkspacesLog[],
    'messages only: should return sorted messages'
  )

  t.deepEquals(
    getWorkspacesLog(
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
    ] as TWorkspacesLog[],
    'messages only: should return sorted messages'
  )

  t.end()
})

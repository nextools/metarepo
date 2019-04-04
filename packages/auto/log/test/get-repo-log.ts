import test from 'blue-tape'
import { getRepoLog } from '../src/get-repo-log'
import { TRepoLog } from '../src/types'

test('getRepoLog', (t) => {
  t.deepEquals(
    getRepoLog(
      {
        version: '1.2.3',
        type: 'patch',
      },
      {
        type: 'patch',
        messages: [
          {
            type: 'patch',
            value: 'message',
          },
        ],
      }
    ),
    {
      version: '1.2.3',
      type: 'patch',
      messages: [
        {
          type: 'patch',
          value: 'message',
        },
      ],
    } as TRepoLog,
    'single git bump'
  )

  t.deepEquals(
    getRepoLog(
      {
        version: '1.2.3',
        type: 'major',
      },
      {
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
      }
    ),
    {
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
    } as TRepoLog,
    'should return sorted messages'
  )

  t.deepEquals(
    getRepoLog(
      {
        version: '1.2.3',
        type: 'major',
      },
      {
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
      }
    ),
    {
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
    } as TRepoLog,
    'should return sorted messages'
  )

  t.end()
})

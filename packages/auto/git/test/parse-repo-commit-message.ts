import test from 'blue-tape'
import { prefixes } from '@auto/utils/test/prefixes'
import { parseRepoCommitMessage } from '../src/parse-repo-commit-message'

test('git:parseWorkspacesCommitMessage', async (t) => {
  t.equals(
    parseRepoCommitMessage(
      '🚨 breaking change',
      prefixes
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.equals(
    parseRepoCommitMessage(
      `${prefixes.required.dependencies.value} dependencies change\nnew line`,
      prefixes
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseRepoCommitMessage(
      `${prefixes.required.publish.value} publish\nnew line`,
      prefixes
    ),
    {
      type: 'publish',
      message: 'publish\nnew line',
    },
    'return publish object'
  )

  t.deepEquals(
    parseRepoCommitMessage(
      `${prefixes.required.major.value} breaking change\nnew line`,
      prefixes
    ),
    {
      type: 'major',
      message: 'breaking change\nnew line',
    },
    'return major object'
  )

  t.deepEquals(
    parseRepoCommitMessage(
      `${prefixes.required.minor.value} minor change\nnew line`,
      prefixes
    ),
    {
      type: 'minor',
      message: 'minor change\nnew line',
    },
    'return minor object'
  )

  t.deepEquals(
    parseRepoCommitMessage(
      `${prefixes.required.patch.value} patch change\nnew line`,
      prefixes
    ),
    {
      type: 'patch',
      message: 'patch change\nnew line',
    },
    'return patch object'
  )

  t.deepEquals(
    parseRepoCommitMessage(
      `${prefixes.required.initial.value} initial change\nnew line`,
      prefixes
    ),
    {
      type: 'initial',
      message: 'initial change\nnew line',
    },
    'return initial object'
  )
})

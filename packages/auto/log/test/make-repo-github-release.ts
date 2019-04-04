import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'
import { prefixes } from '@auto/utils/test/prefixes'
import { TGithubOptions } from '../src/types'

const githubOptions: TGithubOptions = {
  token: 'token',
  username: 'username',
  repo: 'repo',
}

test('makeRepoGithubRelease', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/make-repo-github-release', {
    'request-promise-native': {
      default: spy,
    },
  })

  const { makeRepoGithubRelease } = await import('../src/make-repo-github-release')

  await makeRepoGithubRelease(
    {
      version: '0.1.2',
      type: 'minor',
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
    prefixes,
    githubOptions
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{
        uri: 'https://api.github.com/repos/username/repo/releases',
        method: 'POST',
        headers: {
          Authorization: 'token token',
          'User-Agent': 'auto-tools',
        },
        json: {
          tag_name: 'v0.1.2',
          name: 'v0.1.2',
          body: '* 🌱 minor\n* 🐞 patch',
        },
      }],
    ],
    'should make request'
  )

  unmock('../src/make-repo-github-release')
})

test('makeRepoGithubRelease: throws if there is no token', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/make-repo-github-release', {
    'request-promise-native': {
      default: spy,
    },
  })

  const { makeRepoGithubRelease } = await import('../src/make-repo-github-release')

  try {
    await makeRepoGithubRelease(
      {
        version: '0.1.2',
        type: 'minor',
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
      prefixes,
      // @ts-ignore
      { ...githubOptions, token: undefined }
    )

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'GitHub token is required')
  }

  unmock('../src/make-repo-github-release')
})

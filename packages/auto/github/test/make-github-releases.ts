import type { TPackageRelease, TAutoConfig } from '@auto/core'
import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import type { TGithubConfig } from '../src/types'
import { prefixes } from './prefixes'

const githubConfig: TGithubConfig = {
  token: 'token',
  username: 'username',
  repo: 'repo',
}

const config: TAutoConfig = {
  prefixes,
}

test('makeGithubReleases', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../src/make-github-releases', {
    'node-fetch': {
      default: spy,
    },
  })

  const packages: TPackageRelease[] = [
    {
      name: 'ns/a',
      dir: 'fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0',
      },
      version: '0.2.0',
      type: 'minor',
      deps: null,
      devDeps: null,
      messages: [
        {
          type: 'minor',
          message: 'minor commit',
        },
        {
          type: 'patch',
          message: 'patch commit',
        },
      ],
    },
    {
      name: 'b',
      dir: 'fakes/b',
      json: {
        name: 'b',
        version: '0.0.0',
      },
      version: '0.1.0',
      type: 'initial',
      deps: {
        '@ns/a': '^0.2.0',
      },
      devDeps: null,
      messages: [
        {
          type: 'initial',
          message: 'initial commit',
        },
      ],
    },
    {
      name: 'c',
      dir: 'fakes/c',
      json: {
        name: 'c',
        version: '1.0.0',
      },
      version: '1.1.0',
      type: 'minor',
      deps: {
        b: '^0.1.0',
      },
      devDeps: null,
      messages: [
        {
          type: 'minor',
          message: 'minor commit',
        },
      ],
    },
    {
      name: 'd',
      dir: 'fakes/d',
      json: {
        name: 'd',
        version: '1.0.0',
      },
      version: null,
      type: null,
      deps: null,
      devDeps: {
        b: '^0.1.0',
      },
      messages: null,
    },
  ]

  const { makeGithubReleases } = await import('../src/make-github-releases')

  await makeGithubReleases(githubConfig)({
    config,
    prefixes,
    packages,
  })

  t.deepEquals(
    getSpyCalls(spy),
    [
      [
        'https://api.github.com/repos/username/repo/releases',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'token token', 'User-Agent': 'auto-tools' },
          body: '{"tag_name":"ns/a@0.2.0","name":"ns/a@0.2.0","body":"* 🌱 minor commit\\n* 🐞 patch commit"}',
        },
      ],
      [
        'https://api.github.com/repos/username/repo/releases',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'token token', 'User-Agent': 'auto-tools' },
          body: '{"tag_name":"b@0.1.0","name":"b@0.1.0","body":"* 🐣️ initial commit"}',
        },
      ],
      [
        'https://api.github.com/repos/username/repo/releases',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'token token', 'User-Agent': 'auto-tools' },
          body: '{"tag_name":"c@1.1.0","name":"c@1.1.0","body":"* 🌱 minor commit"}',
        },
      ],
    ],
    'should make request'
  )

  unmockRequire()
})

test('makeGithubReleases: throws if there is no token', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../src/make-github-releases', {
    'node-fetch': {
      default: spy,
    },
  })

  const packages: TPackageRelease[] = [
    {
      name: 'a',
      version: '0.1.0',
      type: 'minor',
      dir: 'dir',
      json: {
        name: 'a',
        version: '0.0.1',
      },
      deps: null,
      devDeps: null,
      messages: [
        {
          type: 'minor',
          message: 'minor',
        },
        {
          type: 'patch',
          message: 'patch',
        },
      ],
    },
    {
      name: 'b',
      version: '1.2.0',
      type: 'minor',
      dir: 'dir',
      json: {
        name: 'b',
        version: '1.1.2',
      },
      deps: null,
      devDeps: null,
      messages: [
        {
          type: 'minor',
          message: 'minor',
        },
        {
          type: 'patch',
          message: 'patch',
        },
      ],
    },
  ]

  const { makeGithubReleases } = await import('../src/make-github-releases')

  try {
    await makeGithubReleases({
      ...githubConfig,
      token: undefined as any,
    })({
      config,
      prefixes,
      packages,
    })

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'GitHub token is required')
  }

  unmockRequire()
})

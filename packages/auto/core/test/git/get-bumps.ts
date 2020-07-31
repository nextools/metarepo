import test from 'tape'
import { getBumps } from '../../src/git/get-bumps'
import type { TGitMessageMap } from '../../src/types'
import { prefixes } from '../prefixes'

test('git:getBumps single package', (t) => {
  const names: string[] = ['foo', '@ns/bar', 'baz']
  const messages: string[] = [
    `${prefixes.minor} foo: minor`,
    `${prefixes.major} foo: major`,
    `${prefixes.patch} foo: patch`,
    `${prefixes.publish} foo: v1.2.3`,
    `${prefixes.initial} foo: initial`,
  ]
  const expectedResult: TGitMessageMap = new Map()

  expectedResult.set('foo', [
    {
      type: 'major',
      message: 'major',
    },
    {
      type: 'minor',
      message: 'minor',

    },
    {
      type: 'patch',
      message: 'patch',
    },
  ])

  t.deepEquals(
    getBumps(names, prefixes, messages),
    expectedResult,
    'bump as patch + major + minor'
  )

  t.end()
})

test('git:getBumps multiple packages', (t) => {
  const names: string[] = ['foo', '@ns/bar', 'baz']
  const messages: string[] = [
    `${prefixes.patch} foo: patch`,
    `${prefixes.publish} foo: v1.0.1`,
    `${prefixes.major} foo: breaking`,
    `${prefixes.patch} ns/bar: patch`,
    `${prefixes.publish} ns/bar: v2.0.1`,
    `${prefixes.major} ns/bar: breaking`,
    `${prefixes.initial} foo: initial`,
    `${prefixes.initial} ns/bar: initial`,
  ]
  const expectedResult: TGitMessageMap = new Map()

  expectedResult.set('foo', [
    {
      type: 'patch',
      message: 'patch',
    },
  ])
  expectedResult.set('@ns/bar', [
    {
      type: 'patch',
      message: 'patch',
    },
  ])

  t.deepEquals(
    getBumps(names, prefixes, messages),
    expectedResult,
    'bump as patch && patch'
  )

  t.end()
})

test('git:getBumps multiple packages in one commit', (t) => {
  const names: string[] = ['foo', '@ns/bar', 'baz']
  const messages: string[] = [
    `${prefixes.patch} foo: patch`,
    `${prefixes.major} foo: breaking`,
    `${prefixes.patch} ns/bar: patch`,
    `${prefixes.publish} foo, ns/bar: release`,
    `${prefixes.major} ns/bar: breaking`,
    `${prefixes.initial} foo: initial`,
    `${prefixes.initial} ns/bar: initial`,
  ]
  const expectedResult: TGitMessageMap = new Map()

  expectedResult.set('foo', [
    {
      type: 'major',
      message: 'breaking',
    },
    {
      type: 'patch',
      message: 'patch',
    },
  ])

  expectedResult.set('@ns/bar', [
    {
      type: 'patch',
      message: 'patch',
    },
  ])

  t.deepEquals(
    getBumps(names, prefixes, messages),
    expectedResult,
    'bump as major && patch'
  )

  t.end()
})

test('git:getBumps star symbol', (t) => {
  const names: string[] = ['foo', '@ns/bar', 'baz']
  const messages: string[] = [
    `${prefixes.minor} *: minor`,
    `${prefixes.patch} foo: patch`,
    `${prefixes.patch} ns/bar: patch`,
    `${prefixes.publish} *: publish`,
  ]
  const expectedResult: TGitMessageMap = new Map()

  expectedResult.set('foo', [
    {
      type: 'minor',
      message: 'minor',
    },
    {
      type: 'patch',
      message: 'patch',
    },
  ])

  expectedResult.set('@ns/bar', [
    {
      type: 'minor',
      message: 'minor',
    },
    {
      type: 'patch',
      message: 'patch',
    },
  ])

  expectedResult.set('baz', [
    {
      type: 'minor',
      message: 'minor',
    },
  ])

  t.deepEquals(
    getBumps(names, prefixes, messages),
    expectedResult,
    'bump as minor && minor'
  )

  t.end()
})

test('git:getBumps string + star symbol', (t) => {
  const names: string[] = ['foo', '@ns/bar', 'baz']
  const messages: string[] = [
    `${prefixes.minor} ba*: minor`,
    `${prefixes.patch} foo: patch\n\ndescription`,
    `${prefixes.publish} *: publish`,
  ]
  const expectedResult: TGitMessageMap = new Map()

  expectedResult.set('@ns/bar', [
    {
      type: 'minor',
      message: 'minor',
    },
  ])

  expectedResult.set('baz', [
    {
      type: 'minor',
      message: 'minor',
    },
  ])

  expectedResult.set('foo', [
    {
      type: 'patch',
      message: 'patch',
      description: 'description',
    },
  ])

  t.deepEquals(
    getBumps(names, prefixes, messages),
    expectedResult,
    'bump as minor && minor'
  )

  t.end()
})

test('git:getBumps skipped commits', (t) => {
  const names: string[] = ['foo', '@ns/bar', 'baz']
  const messages: string[] = [
    `${prefixes.minor} foo: minor`,
    `${prefixes.minor} foo`,
    `${prefixes.major}`,
    'beep',
    `${prefixes.dependencies} foo: upgrade dependencies`,
    `${prefixes.patch} foo: patch`,
    `${prefixes.patch} NonExistingPackage: patch`,
    `${prefixes.publish} foo: v1.0.1`,
  ]
  const expectedResult: TGitMessageMap = new Map()

  expectedResult.set('foo', [
    {
      type: 'minor',
      message: 'minor',
    },
    {
      type: 'patch',
      message: 'patch',
    },
  ])

  t.deepEquals(
    getBumps(names, prefixes, messages),
    expectedResult,
    'skip invalid commit messages'
  )

  t.end()
})

test('git:getBumps multiple packages initial', (t) => {
  const names: string[] = ['foo', '@ns/bar', 'baz']
  const messages: string[] = [
    `${prefixes.patch} foo: patch`,
    `${prefixes.major} foo: breaking`,
    `${prefixes.patch} ns/bar: patch`,
    `${prefixes.initial} baz: initial`,
    `${prefixes.publish} ns/bar: v2.0.1`,
    `${prefixes.major} ns/bar: breaking`,
    `${prefixes.initial} foo: initial`,
    `${prefixes.minor} foo: minor`,
    `${prefixes.initial} ns/bar: initial`,
  ]
  const expectedResult: TGitMessageMap = new Map()

  expectedResult.set('foo', [
    {
      type: 'initial',
      message: 'initial',
    },
  ])

  expectedResult.set('@ns/bar', [
    {
      type: 'patch',
      message: 'patch',
    },
  ])

  expectedResult.set('baz', [
    {
      type: 'initial',
      message: 'initial',
    },
  ])

  t.deepEquals(
    getBumps(names, prefixes, messages),
    expectedResult,
    'bump as patch && patch'
  )

  t.end()
})

test('git:getBumps cannot find initial', (t) => {
  const names: string[] = ['foo', '@ns/bar', 'baz']
  const messages: string[] = [
    `${prefixes.patch} foo: patch`,
    `${prefixes.major} foo: breaking`,
    `${prefixes.patch} ns/bar: patch`,
    `${prefixes.initial} baz: initial`,
    `${prefixes.major} ns/bar: breaking`,
    `${prefixes.minor} foo: minor`,
  ]

  try {
    getBumps(names, prefixes, messages)

    t.fail('should not get here')
  } catch (e) {
    t.equals(
      e.message,
      'Cannot find initial or publish commits for "foo", "@ns/bar" packages',
      'should throw'
    )
  }

  t.end()
})

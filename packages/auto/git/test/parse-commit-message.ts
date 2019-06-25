import test from 'blue-tape'
import { prefixes } from '@auto/utils/test/prefixes'
import { parseCommitMessage } from '../src/parse-commit-message'

test('git:parseCommitMessage', (t) => {
  t.equals(
    parseCommitMessage(
      '🚨 foo: breaking change',
      ['foo'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.equals(
    parseCommitMessage(
      `${prefixes.required.dependencies.value} foo: dependencies change\nnew line`,
      ['foo'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.publish.value} foo: publish\nnew line`,
      ['foo'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    {
      names: ['foo'],
      type: 'publish',
      message: 'publish\nnew line',
    },
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.major.value} foo: breaking change\nnew line`,
      ['foo'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    {
      names: ['foo'],
      type: 'major',
      message: 'breaking change\nnew line',
    },
    'return major'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.major.value} ns/foo: breaking change\nnew line`,
      ['@ns/foo'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    {
      names: ['@ns/foo'],
      type: 'major',
      message: 'breaking change\nnew line',
    },
    'return major'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.minor.value} foo: minor change\nnew line`,
      ['foo'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    {
      names: ['foo'],
      type: 'minor',
      message: 'minor change\nnew line',
    },
    'return minor'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.patch.value} foo: patch change\nnew line`,
      ['foo'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    {
      names: ['foo'],
      type: 'patch',
      message: 'patch change\nnew line',
    },
    'return patch'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.initial.value} foo: initial change\nnew line`,
      ['foo'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    {
      names: ['foo'],
      type: 'initial',
      message: 'initial change\nnew line',
    },
    'return initial'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.initial.value} *: message`,
      ['foo', '@ns/bar'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    {
      names: ['foo', '@ns/bar'],
      type: 'initial',
      message: 'message',
    },
    'return *'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.initial.value} foo*: message`,
      ['foo', 'foo1', 'foo2', 'bar'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    {
      names: ['foo', 'foo1', 'foo2'],
      type: 'initial',
      message: 'message',
    },
    'return foo*'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.initial.value} foo,bar: message`,
      ['foo', '@ns/bar', 'baz'],
      prefixes,
      { autoNamePrefix: '@ns/' }
    ),
    {
      names: ['foo', '@ns/bar'],
      type: 'initial',
      message: 'message',
    },
    'return foo,bar'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.initial.value} foo*,bar: message`,
      ['foo1', '@ns/foo2', 'bar', 'baz'],
      prefixes,
      { autoNamePrefix: '@ns/' }
    ),
    {
      names: ['foo1', '@ns/foo2', 'bar'],
      type: 'initial',
      message: 'message',
    },
    'return foo*,bar'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.initial.value} foo*,ba*: message`,
      ['foo1', 'foo2', 'bar', '@ns/baz'],
      prefixes,
      { autoNamePrefix: '@ns/' }
    ),
    {
      names: ['foo1', 'foo2', 'bar', '@ns/baz'],
      type: 'initial',
      message: 'message',
    },
    'return foo*,ba*'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.initial.value} foo, , bar: message`,
      ['foo', 'bar', 'baz'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    {
      names: ['foo', 'bar'],
      type: 'initial',
      message: 'message',
    },
    'return foo, , bar'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.initial.value} foo, *: message`,
      ['foo', 'foo1', 'bar', '@ns/baz'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    {
      names: ['foo', 'foo1', 'bar', '@ns/baz'],
      type: 'initial',
      message: 'message',
    },
    'return foo, *'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.initial.value} foo, baz: message`,
      ['foo', 'bar'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    {
      names: ['foo'],
      type: 'initial',
      message: 'message',
    },
    'return foo, baz'
  )

  t.deepEquals(
    parseCommitMessage(
      `${prefixes.required.initial.value} foo, baz:`,
      ['foo', 'bar'],
      prefixes,
      { autoNamePrefix: '@' }
    ),
    {
      names: ['foo'],
      type: 'initial',
      message: '',
    },
    'empty message'
  )

  t.end()
})

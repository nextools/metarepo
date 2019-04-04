import test from 'blue-tape'
import { prefixes } from '@auto/utils/test/prefixes'
import { parseWorkspacesCommitMessage } from '../src/parse-workspaces-commit-message'

test('git:parseWorkspacesCommitMessage', (t) => {
  t.equals(
    parseWorkspacesCommitMessage(
      '🚨 foo: breaking change',
      ['foo'],
      prefixes
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.equals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.dependencies.value} foo: dependencies change\nnew line`,
      ['foo'],
      prefixes
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.publish.value} foo: publish\nnew line`,
      ['foo'],
      prefixes
    ),
    {
      names: ['foo'],
      type: 'publish',
      message: 'publish\nnew line',
    },
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.major.value} foo: breaking change\nnew line`,
      ['foo'],
      prefixes
    ),
    {
      names: ['foo'],
      type: 'major',
      message: 'breaking change\nnew line',
    },
    'return major'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.minor.value} foo: minor change\nnew line`,
      ['foo'],
      prefixes
    ),
    {
      names: ['foo'],
      type: 'minor',
      message: 'minor change\nnew line',
    },
    'return minor'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.patch.value} foo: patch change\nnew line`,
      ['foo'],
      prefixes
    ),
    {
      names: ['foo'],
      type: 'patch',
      message: 'patch change\nnew line',
    },
    'return patch'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.initial.value} foo: initial change\nnew line`,
      ['foo'],
      prefixes
    ),
    {
      names: ['foo'],
      type: 'initial',
      message: 'initial change\nnew line',
    },
    'return initial'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.initial.value} *: message`,
      ['foo', 'bar'],
      prefixes
    ),
    {
      names: ['foo', 'bar'],
      type: 'initial',
      message: 'message',
    },
    'return *'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.initial.value} foo*: message`,
      ['foo', 'foo1', 'foo2', 'bar'],
      prefixes
    ),
    {
      names: ['foo', 'foo1', 'foo2'],
      type: 'initial',
      message: 'message',
    },
    'return foo*'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.initial.value} foo,bar: message`,
      ['foo', 'bar', 'baz'],
      prefixes
    ),
    {
      names: ['foo', 'bar'],
      type: 'initial',
      message: 'message',
    },
    'return foo,bar'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.initial.value} foo*,bar: message`,
      ['foo1', 'foo2', 'bar', 'baz'],
      prefixes
    ),
    {
      names: ['foo1', 'foo2', 'bar'],
      type: 'initial',
      message: 'message',
    },
    'return foo*,bar'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.initial.value} foo*,ba*: message`,
      ['foo1', 'foo2', 'bar', 'baz'],
      prefixes
    ),
    {
      names: ['foo1', 'foo2', 'bar', 'baz'],
      type: 'initial',
      message: 'message',
    },
    'return foo*,ba*'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.initial.value} foo, , bar: message`,
      ['foo', 'bar', 'baz'],
      prefixes
    ),
    {
      names: ['foo', 'bar'],
      type: 'initial',
      message: 'message',
    },
    'return foo, , bar'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.initial.value} foo, *: message`,
      ['foo', 'foo1', 'bar', 'baz'],
      prefixes
    ),
    {
      names: ['foo', 'foo1', 'bar', 'baz'],
      type: 'initial',
      message: 'message',
    },
    'return foo, *'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.initial.value} foo, baz: message`,
      ['foo', 'bar'],
      prefixes
    ),
    {
      names: ['foo'],
      type: 'initial',
      message: 'message',
    },
    'return foo, baz'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${prefixes.required.initial.value} foo, baz:`,
      ['foo', 'bar'],
      prefixes
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

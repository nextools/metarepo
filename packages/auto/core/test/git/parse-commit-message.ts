import test from 'tape'
import { parseCommitMessage } from '../../src/git/parse-commit-message'
import { prefixes } from '../prefixes'

test('git:parseCommitMessage', (t) => {
  t.equals(
    parseCommitMessage(['foo'], prefixes)(
      '🚨 foo: breaking change'
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseCommitMessage(['foo'], prefixes)(
      `${prefixes.publish} foo: publish\n\ndescription\nline1\nline2`
    ),
    {
      names: ['foo'],
      type: 'publish',
      message: 'publish',
      description: 'description\nline1\nline2',
    },
    'parse description'
  )

  t.deepEquals(
    parseCommitMessage(['foo'], prefixes)(
      `${prefixes.major} foo: breaking change`
    ),
    {
      names: ['foo'],
      type: 'major',
      message: 'breaking change',
    },
    'return major'
  )

  t.deepEquals(
    parseCommitMessage(['@ns/foo'], prefixes)(
      `${prefixes.major} ns/foo: breaking change`
    ),
    {
      names: ['@ns/foo'],
      type: 'major',
      message: 'breaking change',
    },
    'return major'
  )

  t.deepEquals(
    parseCommitMessage(['foo'], prefixes)(
      `${prefixes.minor} foo: minor change`
    ),
    {
      names: ['foo'],
      type: 'minor',
      message: 'minor change',
    },
    'return minor'
  )

  t.deepEquals(
    parseCommitMessage(['foo'], prefixes)(
      `${prefixes.patch} foo: patch change`
    ),
    {
      names: ['foo'],
      type: 'patch',
      message: 'patch change',
    },
    'return patch'
  )

  t.deepEquals(
    parseCommitMessage(['foo'], prefixes)(
      `${prefixes.initial} foo: initial change`
    ),
    {
      names: ['foo'],
      type: 'initial',
      message: 'initial change',
    },
    'return initial'
  )

  t.deepEquals(
    parseCommitMessage(['foo', '@ns/bar'], prefixes)(
      `${prefixes.initial} *: message`
    ),
    {
      names: ['foo', '@ns/bar'],
      type: 'initial',
      message: 'message',
    },
    'return *'
  )

  t.deepEquals(
    parseCommitMessage(['foo', 'foo1', 'foo2', 'bar'], prefixes)(
      `${prefixes.initial} foo*: message`
    ),
    {
      names: ['foo', 'foo1', 'foo2'],
      type: 'initial',
      message: 'message',
    },
    'return foo*'
  )

  t.deepEquals(
    parseCommitMessage(['foo', '@ns/bar', 'baz'], prefixes)(
      `${prefixes.initial} foo,ns/bar: message`
    ),
    {
      names: ['foo', '@ns/bar'],
      type: 'initial',
      message: 'message',
    },
    'return foo,bar'
  )

  t.deepEquals(
    parseCommitMessage(['foo1', '@ns/foo2', 'bar', 'baz'], prefixes)(
      `${prefixes.initial} foo*,bar: message`
    ),
    {
      names: ['foo1', '@ns/foo2', 'bar'],
      type: 'initial',
      message: 'message',
    },
    'return foo*,bar'
  )

  t.deepEquals(
    parseCommitMessage(['foo1', 'foo2', 'bar', '@ns/baz'], prefixes)(
      `${prefixes.initial} foo*,ba*: message`
    ),
    {
      names: ['foo1', 'foo2', 'bar', '@ns/baz'],
      type: 'initial',
      message: 'message',
    },
    'return foo*,ba*'
  )

  t.deepEquals(
    parseCommitMessage(['foo', 'bar', 'baz'], prefixes)(
      `${prefixes.initial} foo, , bar: message`
    ),
    {
      names: ['foo', 'bar'],
      type: 'initial',
      message: 'message',
    },
    'return foo, , bar'
  )

  t.deepEquals(
    parseCommitMessage(['foo', 'foo1', 'bar', '@ns/baz'], prefixes)(
      `${prefixes.initial} foo, *: message`
    ),
    {
      names: ['foo', 'foo1', 'bar', '@ns/baz'],
      type: 'initial',
      message: 'message',
    },
    'return foo, *'
  )

  t.deepEquals(
    parseCommitMessage(['foo', 'bar'], prefixes)(
      `${prefixes.initial} foo, baz: message`
    ),
    {
      names: ['foo'],
      type: 'initial',
      message: 'message',
    },
    'return foo, baz'
  )

  t.deepEquals(
    parseCommitMessage(['foo', 'bar'], prefixes)(
      `${prefixes.initial} foo, baz:`
    ),
    null,
    'empty message'
  )

  t.end()
})

import test from 'blue-tape'
import { jsonParse, jsonStringify } from '../src'

test('typeon: parse', (t) => {
  t.deepEqual(
    jsonParse('{"a":{"b":["c"]}}'),
    { a: { b: ['c'] } },
    'should parse'
  )

  t.end()
})

test('typeon: stringify', (t) => {
  t.equal(
    jsonStringify({ a: { b: ['c'] } }),
    '{"a":{"b":["c"]}}',
    'should stringify'
  )

  t.end()
})

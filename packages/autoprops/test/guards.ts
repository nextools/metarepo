import test from 'blue-tape'
import { isArray, isBoolean, isNull, isNumber, isString } from '../src/guards'

test('Guards: isNull for number', (t) => {
  t.equals(
    isNull(42),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isNull for undefined', (t) => {
  t.equals(
    isNull(undefined),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isNull for object', (t) => {
  t.equals(
    isNull({}),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isNull for null', (t) => {
  t.equals(
    isNull(null),
    true,
    'should return true'
  )

  t.end()
})

test('Guards: isBoolean for null', (t) => {
  t.equals(
    isBoolean(null),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isBoolean for undefined', (t) => {
  t.equals(
    isBoolean(undefined),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isBoolean for number', (t) => {
  t.equals(
    isBoolean(42),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isBoolean for object', (t) => {
  t.equals(
    isBoolean({}),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isBoolean for true', (t) => {
  t.equals(
    isBoolean(true),
    true,
    'should return true'
  )

  t.end()
})

test('Guards: isBoolean for false', (t) => {
  t.equals(
    isBoolean(false),
    true,
    'should return true'
  )

  t.end()
})

test('Guards: isBoolean for Boolean(0)', (t) => {
  t.equals(
    isBoolean(Boolean(0)),
    true,
    'should return true'
  )

  t.end()
})

test('Guards: isBoolean for Boolean(1)', (t) => {
  t.equals(
    isBoolean(Boolean(1)),
    true,
    'should return true'
  )

  t.end()
})

test('Guards: isNumber for null', (t) => {
  t.equals(
    isNumber(null),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isNumber for undefined', (t) => {
  t.equals(
    isNumber(undefined),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isNumber for empty string', (t) => {
  t.equals(
    isNumber(''),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isNumber for object', (t) => {
  t.equals(
    isNumber({}),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: ', (t) => {
  t.equals(
    isNumber(42),
    true,
    'should return true'
  )

  t.end()
})

test('Guards: isNumber for float', (t) => {
  t.equals(
    isNumber(0.01),
    true,
    'should return true'
  )

  t.end()
})

test('Guards: isNumber for Number', (t) => {
  t.equals(
    isNumber(Number('42')),
    true,
    'should return true'
  )

  t.end()
})

test('Guards: isString for null', (t) => {
  t.equals(
    isString(null),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isString for undefined', (t) => {
  t.equals(
    isString(undefined),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isString for number', (t) => {
  t.equals(
    isString(0),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isString for object', (t) => {
  t.equals(
    isString({}),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isString for empty string', (t) => {
  t.equals(
    isString(''),
    true,
    'should return true'
  )

  t.end()
})

test('Guards: isString for String(number)', (t) => {
  t.equals(
    isString(String(42)),
    true,
    'should return true'
  )

  t.end()
})

test('Guards: isArray for null', (t) => {
  t.equals(
    isArray(null),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isArray for undefined', (t) => {
  t.equals(
    isArray(undefined),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isArray for string', (t) => {
  t.equals(
    isArray(''),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isArray for number', (t) => {
  t.equals(
    isArray(42),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isArray for object', (t) => {
  t.equals(
    isArray({}),
    false,
    'should return false'
  )

  t.end()
})

test('Guards: isArray for array', (t) => {
  t.equals(
    isArray([]),
    true,
    'should return true'
  )

  t.end()
})

test('Guards: isArray for Array', (t) => {
  t.equals(
    isArray(new Array(1)),
    true,
    'should return true'
  )

  t.end()
})

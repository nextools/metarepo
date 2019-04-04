import test from 'blue-tape'
import { isArray, isBoolean, isNull, isNumber, isString } from '../src/guards'

test('Guards: isNull for number', async (t) => {
  t.equals(
    isNull(42),
    false,
    'should return false'
  )
})

test('Guards: isNull for undefined', async (t) => {
  t.equals(
    isNull(undefined),
    false,
    'should return false'
  )
})

test('Guards: isNull for object', async (t) => {
  t.equals(
    isNull({}),
    false,
    'should return false'
  )
})

test('Guards: isNull for null', async (t) => {
  t.equals(
    isNull(null),
    true,
    'should return true'
  )
})


test('Guards: isBoolean for null', async (t) => {
  t.equals(
    isBoolean(null),
    false,
    'should return false'
  )
})

test('Guards: isBoolean for undefined', async (t) => {
  t.equals(
    isBoolean(undefined),
    false,
    'should return false'
  )
})

test('Guards: isBoolean for number', async (t) => {
  t.equals(
    isBoolean(42),
    false,
    'should return false'
  )
})

test('Guards: isBoolean for object', async (t) => {
  t.equals(
    isBoolean({}),
    false,
    'should return false'
  )
})

test('Guards: isBoolean for true', async (t) => {
  t.equals(
    isBoolean(true),
    true,
    'should return true'
  )
})

test('Guards: isBoolean for false', async (t) => {
  t.equals(
    isBoolean(false),
    true,
    'should return true'
  )
})

test('Guards: isBoolean for Boolean(0)', async (t) => {
  t.equals(
    isBoolean(new Boolean(0)),
    true,
    'should return true'
  )
})

test('Guards: isBoolean for Boolean(1)', async (t) => {
  t.equals(
    isBoolean(new Boolean(1)),
    true,
    'should return true'
  )
})


test('Guards: isNumber for null', async (t) => {
  t.equals(
    isNumber(null),
    false,
    'should return false'
  )
})

test('Guards: isNumber for undefined', async (t) => {
  t.equals(
    isNumber(undefined),
    false,
    'should return false'
  )
})

test('Guards: isNumber for empty string', async (t) => {
  t.equals(
    isNumber(''),
    false,
    'should return false'
  )
})

test('Guards: isNumber for object', async (t) => {
  t.equals(
    isNumber({}),
    false,
    'should return false'
  )
})

test('Guards: ', async (t) => {
  t.equals(
    isNumber(42),
    true,
    'should return true'
  )
})

test('Guards: isNumber for float', async (t) => {
  t.equals(
    isNumber(.01),
    true,
    'should return true'
  )
})

test('Guards: isNumber for Number', async (t) => {
  t.equals(
    isNumber(new Number('42')),
    true,
    'should return true'
  )
})


test('Guards: isString for null', async (t) => {
  t.equals(
    isString(null),
    false,
    'should return false'
  )
})

test('Guards: isString for undefined', async (t) => {
  t.equals(
    isString(undefined),
    false,
    'should return false'
  )
})

test('Guards: isString for number', async (t) => {
  t.equals(
    isString(0),
    false,
    'should return false'
  )
})

test('Guards: isString for object', async (t) => {
  t.equals(
    isString({}),
    false,
    'should return false'
  )
})

test('Guards: isString for empty string', async (t) => {
  t.equals(
    isString(''),
    true,
    'should return true'
  )
})

test('Guards: isString for String(number)', async (t) => {
  t.equals(
    isString(new String(42)),
    true,
    'should return true'
  )
})


test('Guards: isArray for null', async (t) => {
  t.equals(
    isArray(null),
    false,
    'should return false'
  )
})

test('Guards: isArray for undefined', async (t) => {
  t.equals(
    isArray(undefined),
    false,
    'should return false'
  )
})

test('Guards: isArray for string', async (t) => {
  t.equals(
    isArray(''),
    false,
    'should return false'
  )
})

test('Guards: isArray for number', async (t) => {
  t.equals(
    isArray(42),
    false,
    'should return false'
  )
})

test('Guards: isArray for object', async (t) => {
  t.equals(
    isArray({}),
    false,
    'should return false'
  )
})

test('Guards: isArray for array', async (t) => {
  t.equals(
    isArray([]),
    true,
    'should return true'
  )
})

test('Guards: isArray for Array', async (t) => {
  t.equals(
    isArray(new Array(1)),
    true,
    'should return true'
  )
})

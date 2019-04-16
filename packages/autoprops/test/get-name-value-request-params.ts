import test from 'blue-tape'
import { createElement } from 'react'
import { getNameValueRequestParamsRaw, getNameValueRequestParams } from '../src/get-name-value-request-params'

test('Request params URI', (t) => {
  t.equals(
    getNameValueRequestParams('name', undefined, 0),
    'name%3Dundefined'
  )

  t.end()
})

test('Request params: no name provided', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('', undefined, 0),
    'undefined'
  )

  t.end()
})

test('Request params: undefined', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', undefined, 0),
    'name=undefined'
  )

  t.end()
})

test('Request params: null', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', null, 0),
    'name=null'
  )

  t.end()
})

test('Request params: true', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', true, 0),
    'name=true'
  )

  t.end()
})

test('Request params: false', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', false, 0),
    'name=false'
  )

  t.end()
})

test('Request params: int', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', 42, 0),
    'name=42'
  )

  t.end()
})

test('Request params: float', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', 42.5, 0),
    'name=42.5'
  )

  t.end()
})

test('Request params: empty string', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', '', 0),
    'name='
  )

  t.end()
})

test('Request params: short string', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', 'Lorem', 0),
    'name=Lorem'
  )

  t.end()
})

test('Request params: string with spaces', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', 'Lorem ipsum', 0),
    'name=Lorem ip_0'
  )

  t.end()
})

test('Request params: long string', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', 'Loremipsumipsumipsumipsumipsumipsumipsum', 0),
    'name=Loremips_0'
  )

  t.end()
})

test('Request params: empty array', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', [], 0),
    'name=Array(0)_0'
  )

  t.end()
})

test('Request params: array', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', ['value0', 'value1'], 0),
    'name=Array(2)_0'
  )

  t.end()
})

test('Request params: date', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', new Date(0), 0),
    'name=1970-01-01_0'
  )

  t.end()
})

test('Request params: react component with displayName', (t) => {
  const rc: any = () => null
  rc.displayName = 'ComponentName'

  t.equals(
    getNameValueRequestParamsRaw('name', rc, 0),
    'name={ComponentName}_0'
  )

  t.end()
})

test('Request params: react component empty displayName', (t) => {
  const rc: any = () => null
  rc.displayName = ''

  t.equals(
    getNameValueRequestParamsRaw('name', rc, 0),
    'name={Component}_0'
  )

  t.end()
})

test('Request params: react element', (t) => {
  const re = createElement('span')

  t.equals(
    getNameValueRequestParamsRaw('name', re, 0),
    'name={Element}_0'
  )

  t.end()
})

test('Request params: function', (t) => {
  const funcName = () => null

  t.equals(
    getNameValueRequestParamsRaw('name', funcName, 0),
    'name={funcName}_0'
  )

  t.end()
})

test('Request params: function', (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', () => null, 0),
    'name=()=>{}_0'
  )

  t.end()
})

test('Request params: regexp', (t) => {
  const re = /test/

  t.equals(
    getNameValueRequestParamsRaw('name', re, 0),
    'name={Regexp}_0'
  )

  t.end()
})

test('Request params: object', (t) => {
  const obj = {}

  t.equals(
    getNameValueRequestParamsRaw('name', obj, 0),
    'name={object}_0'
  )

  t.end()
})

test('Request params: other', (t) => {
  const obj = Symbol('test')

  t.equals(
    getNameValueRequestParamsRaw('name', obj, 0),
    'name={other}_0'
  )

  t.end()
})

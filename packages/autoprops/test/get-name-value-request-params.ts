import test from 'blue-tape'
import { createElement } from 'react'
import { getNameValueRequestParamsRaw, getNameValueRequestParams } from '../src/get-name-value-request-params'

test('Request params URI', async (t) => {
  t.equals(
    getNameValueRequestParams('name', undefined, 0),
    'name%3Dundefined'
  )
})

test('Request params: no name provided', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('', undefined, 0),
    'undefined'
  )
})

test('Request params: undefined', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', undefined, 0),
    'name=undefined'
  )
})

test('Request params: null', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', null, 0),
    'name=null'
  )
})

test('Request params: true', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', true, 0),
    'name=true'
  )
})

test('Request params: false', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', false, 0),
    'name=false'
  )
})

test('Request params: int', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', 42, 0),
    'name=42'
  )
})

test('Request params: float', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', 42.5, 0),
    'name=42.5'
  )
})

test('Request params: empty string', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', '', 0),
    'name='
  )
})

test('Request params: short string', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', 'Lorem', 0),
    'name=Lorem'
  )
})

test('Request params: string with spaces', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', 'Lorem ipsum', 0),
    'name=Lorem ip_0'
  )
})

test('Request params: long string', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', 'Loremipsumipsumipsumipsumipsumipsumipsum', 0),
    'name=Loremips_0'
  )
})

test('Request params: empty array', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', [], 0),
    'name=Array(0)_0'
  )
})

test('Request params: array', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', ['value0', 'value1'], 0),
    'name=Array(2)_0'
  )
})

test('Request params: date', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', new Date(0), 0),
    'name=1970-01-01_0'
  )
})

test('Request params: react component with displayName', async (t) => {
  const rc: any = (_: any) => null
  rc.displayName = 'ComponentName'

  t.equals(
    getNameValueRequestParamsRaw('name', rc, 0),
    'name={ComponentName}_0'
  )
})

test('Request params: react component empty displayName', async (t) => {
  const rc: any = (_: any) => null
  rc.displayName = ''

  t.equals(
    getNameValueRequestParamsRaw('name', rc, 0),
    'name={Component}_0'
  )
})

test('Request params: react element', async (t) => {
  const re = createElement('span')
  t.equals(
    getNameValueRequestParamsRaw('name', re, 0),
    'name={Element}_0'
  )
})

test('Request params: function', async (t) => {
  const funcName = () => null
  t.equals(
    getNameValueRequestParamsRaw('name', funcName, 0),
    'name={funcName}_0'
  )
})

test('Request params: function', async (t) => {
  t.equals(
    getNameValueRequestParamsRaw('name', () => null, 0),
    'name=()=>{}_0'
  )
})

test('Request params: regexp', async (t) => {
  const re = /test/
  t.equals(
    getNameValueRequestParamsRaw('name', re, 0),
    'name={Regexp}_0'
  )
})

test('Request params: object', async (t) => {
  const obj = {}
  t.equals(
    getNameValueRequestParamsRaw('name', obj, 0),
    'name={object}_0'
  )
})

test('Request params: other', async (t) => {
  const obj = Symbol('test')
  t.equals(
    getNameValueRequestParamsRaw('name', obj, 0),
    'name={other}_0'
  )
})

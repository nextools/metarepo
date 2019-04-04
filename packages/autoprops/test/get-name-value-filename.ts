import test from 'blue-tape'
import { createElement } from 'react'
import { getNameValueFilenameRaw } from '../src/get-name-value-filename'

test('FileName: no name provided', async (t) => {
  t.equals(
    getNameValueFilenameRaw('', undefined, 0),
    'undefined'
  )
})

test('FileName: undefined', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', undefined, 0),
    'name=undefined'
  )
})


test('FileName: null', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', null, 0),
    'name=null'
  )
})


test('FileName: true', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', true, 0),
    'name'
  )
})

test('FileName: false', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', false, 0),
    ''
  )
})


test('FileName: int', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', 42, 0),
    'name=42'
  )
})

test('FileName: float', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', 42.5, 0),
    'name=42.5'
  )
})


test('FileName: empty string', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', '', 0),
    'name={empty}'
  )
})

test('FileName: normal string', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', 'Lorem', 0),
    'name=Lorem'
  )
})

test('FileName: string with spaces', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', 'Lorem ipsum', 0),
    'name=Lorem-0'
  )
})

test('FileName: long string', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', 'Loremipsumipsumipsumipsumipsumipsumipsum', 0),
    'name=Loremipsumip-0'
  )
})

test('FileName: empty array', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', [], 0),
    'name=Array(0)-0'
  )
})

test('FileName: array', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', ['value0', 'value1'], 0),
    'name=Array(2)-0'
  )
})


test('FileName: date', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', new Date(0), 0),
    'name=1970-01-01-0'
  )
})

test('FileName: react component', async (t) => {
  const rc = (_: any) => null
  rc.displayName = 'ComponentName'

  t.equals(
    getNameValueFilenameRaw('name', rc, 0),
    'name={ComponentName}'
  )
})

test('FileName: react component with empty displayName', async (t) => {
  const rc = (_: any) => null
  rc.displayName = ''

  t.equals(
    getNameValueFilenameRaw('name', rc, 0),
    'name={Component}-0'
  )
})

test('FileName: react element', async (t) => {
  const re = createElement('span')
  t.equals(
    getNameValueFilenameRaw('name', re, 0),
    'name={span}-0'
  )
})

test('FileName: function with name', async (t) => {
  const funcName = () => {}
  t.equals(
    getNameValueFilenameRaw('name', funcName, 0),
    'name={funcName}-0'
  )
})

test('FileName: unnamed function', async (t) => {
  t.equals(
    getNameValueFilenameRaw('name', () => {}, 0),
    'name=()=>{}-0'
  )
})

test('FileName: regexp', async (t) => {
  const re = /test/
  t.equals(
    getNameValueFilenameRaw('name', re, 0),
    'name={Regexp}-0'
  )
})

test('FileName: object', async (t) => {
  const obj = {}
  t.equals(
    getNameValueFilenameRaw('name', obj, 0),
    'name={object}-0'
  )
})

test('FileName: other', async (t) => {
  const obj = Symbol('test')
  t.equals(
    getNameValueFilenameRaw('name', obj, 0),
    'name={other}-0'
  )
})

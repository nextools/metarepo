import test from 'blue-tape'
import { createElement } from 'react'
import { getNameValueFilenameRaw } from '../src/get-name-value-filename'

test('FileName: no name provided', (t) => {
  t.equals(
    getNameValueFilenameRaw('', undefined, 0),
    'undefined'
  )

  t.end()
})

test('FileName: undefined', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', undefined, 0),
    'name=undefined'
  )

  t.end()
})

test('FileName: null', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', null, 0),
    'name=null'
  )

  t.end()
})

test('FileName: true', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', true, 0),
    'name'
  )

  t.end()
})

test('FileName: false', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', false, 0),
    ''
  )

  t.end()
})

test('FileName: int', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', 42, 0),
    'name=42'
  )

  t.end()
})

test('FileName: float', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', 42.5, 0),
    'name=42.5'
  )

  t.end()
})

test('FileName: empty string', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', '', 0),
    'name={empty}'
  )

  t.end()
})

test('FileName: normal string', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', 'Lorem', 0),
    'name=Lorem'
  )

  t.end()
})

test('FileName: string with spaces', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', 'Lorem ipsum', 0),
    'name=Lorem-0'
  )

  t.end()
})

test('FileName: long string', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', 'Loremipsumipsumipsumipsumipsumipsumipsum', 0),
    'name=Loremipsumip-0'
  )

  t.end()
})

test('FileName: empty array', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', [], 0),
    'name=Array(0)-0'
  )

  t.end()
})

test('FileName: array', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', ['value0', 'value1'], 0),
    'name=Array(2)-0'
  )

  t.end()
})

test('FileName: date', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', new Date(0), 0),
    'name=1970-01-01-0'
  )

  t.end()
})

test('FileName: react component', (t) => {
  const rc = () => null
  rc.displayName = 'ComponentName'

  t.equals(
    getNameValueFilenameRaw('name', rc, 0),
    'name={ComponentName}'
  )

  t.end()
})

test('FileName: react component with empty displayName', (t) => {
  const rc = () => null
  rc.displayName = ''

  t.equals(
    getNameValueFilenameRaw('name', rc, 0),
    'name={Component}-0'
  )

  t.end()
})

test('FileName: react element', (t) => {
  const re = createElement('span')

  t.equals(
    getNameValueFilenameRaw('name', re, 0),
    'name={span}-0'
  )

  t.end()
})

test('FileName: function with name', (t) => {
  const funcName = () => {}

  t.equals(
    getNameValueFilenameRaw('name', funcName, 0),
    'name={funcName}-0'
  )

  t.end()
})

test('FileName: unnamed function', (t) => {
  t.equals(
    getNameValueFilenameRaw('name', () => {}, 0),
    'name=()=>{}-0'
  )

  t.end()
})

test('FileName: regexp', (t) => {
  const re = /test/

  t.equals(
    getNameValueFilenameRaw('name', re, 0),
    'name={Regexp}-0'
  )

  t.end()
})

test('FileName: object', (t) => {
  const obj = {}

  t.equals(
    getNameValueFilenameRaw('name', obj, 0),
    'name={object}-0'
  )

  t.end()
})

test('FileName: other', (t) => {
  const obj = Symbol('test')

  t.equals(
    getNameValueFilenameRaw('name', obj, 0),
    'name={other}-0'
  )

  t.end()
})

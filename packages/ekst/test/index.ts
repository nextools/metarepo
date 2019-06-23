import test from 'blue-tape'
import { appendExt, prependExt, replaceExt, removeExt } from '../src'

test('ekst: appendExt', (t) => {
  t.equal(
    appendExt('file', '.a'),
    'file.a',
    'should append extension if there were no any extensions'
  )

  t.equal(
    appendExt('file.a.b', '.c'),
    'file.a.b.c',
    'should append extension to existing ones'
  )

  t.end()
})

test('ekst: prependExt', (t) => {
  t.equal(
    prependExt('file', '.a'),
    'file',
    'should do nothing if there were no any extensions'
  )

  t.equal(
    prependExt('file.b.c', '.a'),
    'file.a.b.c',
    'should prepend extension to existing ones'
  )

  t.end()
})

test('ekst: replaceExt', (t) => {
  t.equal(
    replaceExt('file.a.d.c', '.d', '.b'),
    'file.a.b.c',
    'should replace one extension with another'
  )

  t.equal(
    replaceExt('file.a.d.c.d.d', '.d', '.b'),
    'file.a.b.c.b.b',
    'should replace one extension with another multiple times'
  )

  t.equal(
    replaceExt('file.a.b.c', '.d', '.e'),
    'file.a.b.c',
    'should do nothing if there was no such extension'
  )

  t.equal(
    replaceExt('file.a.dd.c', '.d', '.b'),
    'file.a.dd.c',
    'should skip extensions which starts with the target one'
  )

  t.end()
})

test('ekst: removeExt', (t) => {
  t.equal(
    removeExt('file.a.b.c.d', '.d'),
    'file.a.b.c',
    'should remove extension'
  )

  t.equal(
    removeExt('file.a.d.b.d.c.d.d', '.d'),
    'file.a.b.c',
    'should remove extension multiple times'
  )

  t.equal(
    removeExt('file.a.b.c', '.d'),
    'file.a.b.c',
    'should do nothing if there was no such extension'
  )

  t.equal(
    removeExt('file.a.dd.d.c', '.d'),
    'file.a.dd.c',
    'should skip extensions which starts with the target one'
  )

  t.end()
})

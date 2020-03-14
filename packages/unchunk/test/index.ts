import { EventEmitter } from 'events'
import test from 'blue-tape'
import { unchunkBuffer, unchunkString, unchunkJson } from '../src'

test('unchunk: unchunkBuffer', (t) => {
  const emitter = new EventEmitter()

  unchunkBuffer(emitter)
    .then((buf) => {
      t.deepEqual(
        Array.from(buf),
        [0, 1, 2, 3, 4, 5],
        'should work'
      )
      t.end()
    })
    .catch(() => {
      t.fail('should not get here')
    })

  emitter.emit('data', Buffer.from([0, 1, 2]))
  emitter.emit('data', Buffer.from([3, 4, 5]))
  emitter.emit('end')
})

test('unchunk: unchunkBuffer with error', (t) => {
  const emitter = new EventEmitter()

  unchunkBuffer(emitter)
    .then(() => {
      t.fail('should not get here')
    })
    .catch((e) => {
      t.equal(
        e,
        'oops',
        'should throw error'
      )
      t.end()
    })

  emitter.emit('error', 'oops')
  emitter.emit('end')
})

test('unchunk: unchunkString', (t) => {
  const emitter = new EventEmitter()

  unchunkString(emitter)
    .then((str) => {
      t.deepEqual(
        str,
        'hello',
        'should work'
      )
      t.end()
    })
    .catch(() => {
      t.fail('should not get here')
    })

  emitter.emit('data', Buffer.from('hel'))
  emitter.emit('data', Buffer.from('lo'))
  emitter.emit('end')
})

test('unchunk: unchunkString with error', (t) => {
  const emitter = new EventEmitter()

  unchunkString(emitter)
    .then(() => {
      t.fail('should not get here')
    })
    .catch((e) => {
      t.equal(
        e,
        'oops',
        'should throw error'
      )
      t.end()
    })

  emitter.emit('error', 'oops')
  emitter.emit('end')
})

test('unchunk: unchunkJson', (t) => {
  const emitter = new EventEmitter()

  unchunkJson(emitter)
    .then((json) => {
      t.deepEqual(
        json,
        { a: 1, b: 2 },
        'should work'
      )
      t.end()
    })
    .catch(() => {
      t.fail('should not get here')
    })

  emitter.emit('data', Buffer.from('{"a":1,'))
  emitter.emit('data', Buffer.from('"b":2}'))
  emitter.emit('end')
})

test('unchunk: unchunkJson with error', (t) => {
  const emitter = new EventEmitter()

  unchunkJson(emitter)
    .then(() => {
      t.fail('should not get here')
    })
    .catch((e) => {
      t.equal(
        e,
        'oops',
        'should throw error'
      )
      t.end()
    })

  emitter.emit('error', 'oops')
  emitter.emit('end')
})

import test from 'tape'
import debug from 'debug'
import fn from 'test-fn'
import { writable, producer } from '../src'
import { makeStrings, finished, numEvents } from './utils'

test('[ producer / writable: eager producer / sync writable ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = writable({ log: debug('nst:writable') })({ decodeStrings: false })(spy)
  const beginProducing = producer({ eager: true, log: debug('nst:producer') })(data)(stream)

  beginProducing()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    Array.from(data).map((v) => [v])
  )
  t.equals(
    numEvents(stream),
    0
  )
})

test('[ producer / writable: lazy producer / sync writable ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = writable({ log: debug('nst:writable') })({ decodeStrings: false })(spy)
  const beginProducing = producer({ eager: false, log: debug('nst:producer') })(data)(stream)

  beginProducing()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    Array.from(data).map((v) => [v])
  )
  t.equals(
    numEvents(stream),
    0
  )
})

test('[ producer / writable: eager producer / async writable ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = writable({ delayMs: 10, log: debug('nst:writable') })({ highWaterMark: 16, decodeStrings: false })(spy)
  const beginProducing = producer({ eager: true, log: debug('nst:producer') })(data)(stream)

  beginProducing()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    Array.from(data).map((v) => [v])
  )
  t.equals(
    numEvents(stream),
    0
  )
})

test('[ producer / writable: lazy producer / async writable ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = writable({ delayMs: 10, log: debug('nst:writable') })({ highWaterMark: 16, decodeStrings: false })(spy)
  const beginProducing = producer({ eager: false, log: debug('nst:producer') })(data)(stream)

  beginProducing()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    Array.from(data).map((v) => [v])
  )
  t.equals(
    numEvents(stream),
    0
  )
})

test('[ producer / writable: eager producer - unsubscribe ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = writable({ log: debug('nst:writable') })({ decodeStrings: false })(spy)
  const beginProducing = producer({ eager: true, log: debug('nst:producer') })(data)(stream)

  const unsub = beginProducing()

  unsub()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    []
  )
  t.equals(
    numEvents(stream),
    0
  )
})

test('[ producer / writable: eager producer - break on error ]', async (t) => {
  const data = makeStrings(8)

  const spy = fn(debug('nst:sink: '))
  const stream = writable({ log: debug('nst:writable'), errorAtStep: 0 })({ decodeStrings: false })(spy)
  const beginProducing = producer({ eager: true, log: debug('nst:producer') })(data)(stream)

  beginProducing()

  await finished(stream)

  t.deepEquals(
    spy.calls, [
      [Array.from(data)[0]],
    ]
  )
  t.equals(
    numEvents(stream),
    0
  )
})

test('[ producer / writable: eager producer - continue on error ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = writable({ log: debug('nst:writable'), errorAtStep: 0 })({ decodeStrings: false })(spy)
  const beginProducing = producer({ eager: true, log: debug('nst:producer'), continueOnError: true })(data)(stream)

  beginProducing()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    Array.from(data).map((v) => [v])
  )
  t.equals(
    numEvents(stream),
    0
  )
})

test('[ producer / writable: lazy producer - break on error ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = writable({ log: debug('nst:writable'), errorAtStep: 0 })({ decodeStrings: false })(spy)
  const beginProducing = producer({ eager: false, log: debug('nst:producer') })(data)(stream)

  beginProducing()

  await finished(stream)

  t.deepEquals(
    spy.calls, [
      [Array.from(data)[0]],
    ]
  )
  t.equals(
    numEvents(stream),
    0
  )
})

test('[ producer / writable: lazy producer - continue on error ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = writable({ log: debug('nst:writable'), errorAtStep: 0 })({ decodeStrings: false })(spy)
  const beginProducing = producer({ eager: false, log: debug('nst:producer'), continueOnError: true })(data)(stream)

  beginProducing()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    Array.from(data).map((v) => [v])
  )
  t.equals(
    numEvents(stream),
    0
  )
})

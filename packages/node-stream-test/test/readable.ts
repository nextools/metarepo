import { Readable } from 'stream'
import test from 'tape'
import debug from 'debug'
import fn from 'test-fn'
import { readable } from '../src/readable'
import { pushConsumer } from '../src/push-consumer'
import { pullConsumer } from '../src/pull-consumer'
import { makeStrings, finished, numEvents, makeNumbers } from './utils'

const logReadable = debug('nst:readable')
const logConsumer = debug('nst:consumer')
const destroyLog = debug('nst:destroy')
const destroyFn = (stream: Readable) => (value: any) => {
  destroyLog('destroying stream', value)
  stream.destroy()
}

/**
 * LAZY PRODUCER
 * on every _read() pushes one chunk with 'this.push()'
 * Node just calls _read() until internal buffer is full
 * works fine with both 'data' and 'readable' consumer
 * Node respects highWaterMark, by stopping calling _read()
 */

/**
 * EAGER PRODUCER
 * on first _read() repeats 'this.push()' until internal buffer is full
 * works fine with both 'data' and 'readable' consumer
 * highWaterMark limits amount of pushed data, by returning 'false' from 'this.push()'
 */

/**
 * ASYNC PRODUCER
 * on _read() does not immediately 'this.push()' the chunk
 * Node will NOT call _read() again, until 'this.push()' invoked
 * On next 'this.push()', Node will immediately call _read() again
 * In LAZY-ASYNC this is ok (pushes chunks one-by-one after every _read())
 * In EAGER-ASYNC, special guard value should be used
 */

/**
   * PUSH CONSUMER
   * for every 'this.push()', there will be 'data' event, giving corresponding chunk
   * Balanced behavior
   * Good for any type of data
   * Best for 'object-mode'
   */

/**
   * for every single 'push' one 'data' event
   */
test('[ readable / push-consumer: lazy-sync-readable / push-consumer ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: false, log: logReadable })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    Array.from(data).map((v) => [v])
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / push-consumer: lazy-async-readable / push-consumer ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: false, delayMs: 10, log: logReadable })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    Array.from(data).map((v) => [v])
  )
  t.deepEquals(numEvents(stream), 0)
})

/**
     * allows several 'push'es up to highWaterMark
     * then begins sending 'data' event
     * number of 'data' equals number of 'push'
     */
test('[ readable / push-consumer: eager-sync-readable / push-consumer ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable })({ encoding: 'utf8', highWaterMark: 32 })(data)
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    Array.from(data).map((v) => [v])
  )
  t.deepEquals(numEvents(stream), 0)
})

/**
     * for every EAGER 'push' there is synchronous 'data' event
     * highWaterMark is not needed
     */
test('[ readable / push-consumer: eager-async-readable / push-consumer ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, delayMs: 20, log: logReadable })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    Array.from(data).map((v) => [v])
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / push-consumer: \'null\' value is being converted to undefined ]', async (t) => {
  const data = [null, null]
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable })({ objectMode: true })(data)
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    [
      [undefined],
      [undefined],
    ]
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / push-consumer: eager-sync-readable - error break / push-consumer - error break ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable, errorAtStep: 2 })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    []
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / push-consumer: eager-sync-readable - error continue / push-consumer - error break ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable, errorAtStep: 2, continueOnError: true })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    []
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / push-consumer: eager-sync-readable - error break / push-consumer - error continue ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable, errorAtStep: 2 })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pushConsumer({ log: logConsumer, continueOnError: true })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    [
      ['#0000000'],
      ['#0000001'],
    ]
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / push-consumer: eager-sync-readable - error continue / push-consumer - error continue ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable, errorAtStep: 2, continueOnError: true })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pushConsumer({ log: logConsumer, continueOnError: true })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    Array.from(data).map((v) => [v])
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / push-consumer: eager-sync-readable / push-consumer - unsubscribe ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  const unsub = subscribeConsumer()

  unsub()

  await finished(stream)

  t.deepEquals(spy.calls, [])
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / push-consumer: eager-sync-readable - destroy / push-consumer ]', async (t) => {
  const data = makeNumbers(4)
  const stream = readable({ eager: true, log: logReadable })({ objectMode: true })(data)
  const spy = fn(destroyFn(stream))
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    [
      [0], [1], [2], [3],
    ]
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / push-consumer: lazy-async-readable - destroy / push-consumer ]', async (t) => {
  const data = makeNumbers(4)
  const stream = readable({ eager: false, delayMs: 10, log: logReadable })({ objectMode: true })(data)
  const spy = fn(destroyFn(stream))
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    [
      [0],
    ]
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / push-consumer: lazy-sync-readable - empty / push-consumer ]', async (t) => {
  const data = makeNumbers(0)
  const stream = readable({ eager: false, log: logReadable })({ objectMode: true })(data)
  const spy = fn(destroyFn(stream))
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    []
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / push-consumer: lazy-async-readable - empty / push-consumer ]', async (t) => {
  const data = makeNumbers(0)
  const stream = readable({ eager: false, delayMs: 10, log: logReadable })({ objectMode: true })(data)
  const spy = fn(destroyFn(stream))
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    []
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / push-consumer: eager-sync-readable - empty / push-consumer ]', async (t) => {
  const data = makeNumbers(0)
  const stream = readable({ eager: true, log: logReadable })({ objectMode: true })(data)
  const spy = fn(destroyFn(stream))
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(spy.calls, [])
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / push-consumer: eager-async-readable - empty / push-consumer ]', async (t) => {
  const data = makeNumbers(0)
  const stream = readable({ eager: true, delayMs: 10, log: logReadable })({ objectMode: true })(data)
  const spy = fn(destroyFn(stream))
  const subscribeConsumer = pushConsumer({ log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    []
  )
  t.deepEquals(numEvents(stream), 0)
})

/**
   * EAGER PULL CONSUMER
   * On 'readable' event starts 'stream.read()' until there is no data left
   * every 'stream.read()' invokes 'readable.read()',
   * and if stream is lazy, it returns chunk, so 'stream.read()' immediately returns that chunk
   * This forces stream to give all its data, one-by-one
   * Then series of 'readable' events continues to be emitted from stream
   * Then stream 'ends'
   * Bad, not optimal
   */
test('[ readable / pull-consumer: eager-sync-readable / eager-sync-pull-consumer ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable })({ encoding: 'utf8', highWaterMark: 64 })(data)
  const subscribeConsumer = pullConsumer({ eager: true, log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    [
      [Array.from(data).join('')],
    ]
  )
  t.deepEquals(numEvents(stream), 0)
})

/**
   * EAGER ASYNC PULL CONSUMER
   */
test('[ readable / pull-consumer: eager-sync-readable / eager-async-pull-consumer ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable })({ encoding: 'utf8', highWaterMark: 64 })(data)
  const subscribeConsumer = pullConsumer({ eager: true, delayMs: 10, log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    [
      [Array.from(data).join('')],
    ]
  )
  t.deepEquals(numEvents(stream), 0)
})

/**
   * LAZY PULL CONSUMER
   * On 'readable' event makes one 'stream.read'
   * Allows buffered data to arrive in one large chunk
   * Good for concatenatable data (strings, buffers)
   * Bad for 'object-mode', stream never ends
   */
test('[ readable / pull-consumer: eager-sync-readable / lazy-sync-pull-consumer ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pullConsumer({ eager: false, log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    [
      [Array.from(data).join('')],
    ]
  )
  t.deepEquals(numEvents(stream), 0)
})

/**
   * LAZY ASYNC PULL CONSUMER
   * 'readable' event arrives immediately after first 'this.push()'
   * Consuming this chunk, with stream.read(),
   * means stream becomes empty, and you wait for the next 'readable'
   * You can postpone stream.read(), allowing stream to fill its buffer
   * highWaterMark works perfectly here, affects 'readable' event count
   * Best for concatenatable data (strings, buffers)
   * Bad for 'object-mode', stream never ends
   */
test('[ readable / pull-consumer: eager-sync-readable / lazy-async-pull-consumer ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pullConsumer({ eager: false, delayMs: 10, log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    [
      [Array.from(data).join('')],
    ]
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / pull-consumer: eager-sync-readable - error break / pull-consumer - error break ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable, errorAtStep: 0 })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pullConsumer({ eager: true, log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    []
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / pull-consumer: eager-sync-readable - error continue / pull-consumer - error break ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable, errorAtStep: 0, continueOnError: true })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pullConsumer({ eager: true, log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    []
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / pull-consumer: eager-sync-readable - error break / pull-consumer - error continue ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable, errorAtStep: 0 })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pullConsumer({ eager: true, log: logConsumer, continueOnError: true })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    []
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / pull-consumer: eager-sync-readable - error continue / pull-consumer - error continue ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable, errorAtStep: 0, continueOnError: true })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pullConsumer({ eager: true, log: logConsumer, continueOnError: true })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    [
      [Array.from(data).join('')],
    ]
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / pull-consumer: eager-sync-readable / pull-consumer - unsubscribe ]', async (t) => {
  const data = makeStrings(8)
  const spy = fn(debug('nst:sink: '))
  const stream = readable({ eager: true, log: logReadable })({ encoding: 'utf8' })(data)
  const subscribeConsumer = pullConsumer({ eager: true, log: logConsumer })(spy)(stream)

  const unsub = subscribeConsumer()

  unsub()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    []
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / pull-consumer: eager-sync-readable - destroy / eager-pull-consumer ]', async (t) => {
  const data = makeNumbers(4)
  const stream = readable({ eager: true, log: logReadable })({ objectMode: true })(data)
  const spy = fn(destroyFn(stream))
  const subscribeConsumer = pullConsumer({ eager: true, log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    [
      [0], [1], [2], [3],
    ]
  )
  t.deepEquals(numEvents(stream), 0)
})

test('[ readable / pull-consumer: lazy-async-readable - destroy / eager-pull-consumer ]', async (t) => {
  const data = makeNumbers(4)
  const stream = readable({ eager: false, delayMs: 10, log: logReadable })({ objectMode: true })(data)
  const spy = fn(destroyFn(stream))
  const subscribeConsumer = pullConsumer({ eager: true, log: logConsumer })(spy)(stream)

  subscribeConsumer()

  await finished(stream)

  t.deepEquals(
    spy.calls,
    [
      [0],
    ]
  )
  t.deepEquals(numEvents(stream), 0)
})

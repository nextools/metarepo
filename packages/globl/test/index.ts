import test from 'tape'
import * as globl from '../src'

test('globl: *', (t) => {
  t.equal(
    globl.setTimeout,
    global.setTimeout,
    'setTimeout'
  )

  t.equal(
    globl.clearTimeout,
    global.clearTimeout,
    'clearTimeout'
  )

  t.equal(
    globl.setInterval,
    global.setInterval,
    'setInterval'
  )

  t.equal(
    globl.clearInterval,
    global.clearInterval,
    'clearInterval'
  )

  t.equal(
    globl.setImmediate,
    global.setImmediate,
    'setImmediate'
  )

  t.equal(
    globl.clearImmediate,
    global.clearImmediate,
    'clearImmediate'
  )

  t.equal(
    globl.requestAnimationFrame,
    global.requestAnimationFrame,
    'requestAnimationFrame'
  )

  t.equal(
    globl.cancelAnimationFrame,
    global.cancelAnimationFrame,
    'cancelAnimationFrame'
  )

  t.equal(
    globl.console,
    global.console,
    'console'
  )

  t.equal(
    globl.process,
    global.process,
    'process'
  )

  t.equal(
    globl.Date,
    global.Date,
    'Date'
  )

  t.equal(
    globl.performance,
    global.performance,
    'performance'
  )

  t.end()
})

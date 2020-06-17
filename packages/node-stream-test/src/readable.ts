/* eslint-disable no-invalid-this */
import { Readable, ReadableOptions } from 'stream'
import { iterate } from 'iterama'
import { waitTime as wait } from '@psxcode/wait'
import { isPositiveNumber, noop } from './utils'

export type MakeReadableOptions = {
  log?: typeof console.log,
  errorAtStep?: number,
  continueOnError?: boolean,
  delayMs?: number,
  eager: boolean,
}

export const readable = ({ log = noop, errorAtStep, continueOnError = false, eager, delayMs }: MakeReadableOptions) =>
  (readableOptions: ReadableOptions) => (iterable: Iterable<any>) => {
    let unsubscribe: (() => void) | undefined
    const it = iterate(iterable)
    let i = 0
    let done = false

    const push = function(this: Readable): boolean {
      if (i === errorAtStep) {
        log('emitting error at %d', i)
        this.emit('error', new Error(`error at ${i}`))

        if (!continueOnError) {
          log('break on error at %d', i)
          this.push(null)

          return false
        }
      }

      const iteratorResult = it.next()

      if (done || iteratorResult.done) {
        log('complete at %d', i)
        this.push(null)

        return false
      }

      log('push %d', i)

      const isOk = this.push(
        iteratorResult.value !== null
          ? iteratorResult.value
          : undefined
      )

      if (!isOk) {
        log('backpressure at %d', i)
      }

      ++i

      return isOk
    }

    const syncHandler = function(this: Readable) {
      if (eager) {
        log('eager read begin at %d', i)

        // eslint-disable-next-line no-empty
        while (push.call(this)) {}

        log('eager read end at %d', i)
      } else {
        log('lazy read %d', i)
        push.call(this)
      }
    }

    const asyncHandler = function(this: Readable) {
      log('async read started')
      unsubscribe = wait(syncHandler.bind(this))(delayMs)
    }

    const readable = new Readable({
      ...readableOptions,
      read: isPositiveNumber(delayMs)
        ? asyncHandler
        : syncHandler,
      destroy() {
        unsubscribe && unsubscribe()
        this.push(null)
      },
    })

    readable.on('removeListener', (name) => {
      log('removeListener for \'%s\', total: %d', name, readable.listenerCount(name))

      if (name === 'data' || name === 'readable') {
        if (readable.listenerCount('data') === 0 && readable.listenerCount('readable') === 0) {
          log('no more listeners for data - draining data')
          /* when "read" invoked by node, you have to "push" something. Calling "resume" does not work */
          done = true
          /* in some cases "push(null)" has no effect, but "resume" does */
          setImmediate(() => readable.resume())
        }
      }
    })

    readable.on('newListener', (name) => {
      log('newListener for \'%s\', total: %d', name, readable.listenerCount(name) + 1)
    })

    return readable
  }


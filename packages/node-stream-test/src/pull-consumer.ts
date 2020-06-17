import { isPositiveNumber, noop } from './utils'

export type PullConsumerOptions = {
  log?: typeof console.log,
  eager: boolean,
  delayMs?: number,
  readSizeLimit?: number,
  continueOnError?: boolean,
}

export const pullConsumer = ({ log = noop, delayMs, readSizeLimit, eager, continueOnError }: PullConsumerOptions) =>
  (sink: (data: any) => void) => (stream: NodeJS.ReadableStream) => {
    let done = false
    let i = 0
    const eagerReader = () => {
      if (done) {
        return
      }

      let chunk: any

      log('eager read at %d begin', i)

      while ((chunk = stream.read(readSizeLimit)) !== null) {
        sink(chunk)
        ++i
      }

      log('eager read at %d done', i)
    }
    const lazyReader = () => {
      if (done) {
        return
      }

      log('lazy read at %d begin', i)

      const chunk = stream.read(readSizeLimit)

      if (chunk !== null) {
        sink(chunk)
        ++i
      }

      log('lazy read at %d done', i)
    }
    const onErrorEvent = (err?: Error) => {
      log('received "error" event at %d: %s', i, err?.message)

      if (!continueOnError) {
        // eslint-disable-next-line no-use-before-define
        unsubscribe()
      }
    }
    const asyncHandler = () => {
      log('received "readable" event at %d', i)
      setTimeout(
        eager
          ? eagerReader
          : lazyReader,
        delayMs!
      )
    }
    const syncHandler = () => {
      log('received "readable" event at %d', i)
      setImmediate(
        eager
          ? eagerReader
          : lazyReader
      )
    }
    const unsubscribe = () => {
      log('unsubscribe at %d', i)
      done = true
      stream.removeListener('readable', asyncHandler)
      stream.removeListener('readable', syncHandler)
      stream.removeListener('end', unsubscribe)
      stream.removeListener('error', onErrorEvent)
      /* drain the stream */
      setImmediate(stream.resume.bind(stream))
    }

    return () => {
      /* subscribe */
      log('consumer subscribe')
      stream.addListener('readable', isPositiveNumber(delayMs) ? asyncHandler : syncHandler)
      stream.addListener('end', unsubscribe)
      stream.addListener('error', onErrorEvent)

      return unsubscribe
    }
  }

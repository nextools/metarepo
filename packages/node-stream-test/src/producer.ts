import { iterate } from 'iterama'
import { noop } from './utils'

export type ProducerOptions = {
  log?: typeof console.log,
  eager: boolean,
  continueOnError?: boolean,
}

export const producer = ({ eager, log = noop, continueOnError = false }: ProducerOptions) =>
  (iterable: Iterable<any>) => (stream: NodeJS.WritableStream) => {
    const it = iterate(iterable)
    let done = false
    let i = 0
    const writeChunk = (cb?: () => void): boolean => {
      let iteratorResult: IteratorResult<any>

      if (done || (iteratorResult = it.next()).done) {
        log('ending %d', i)
        stream.end()

        return false
      }

      log('writing to stream %d', i++)

      const isOk = stream.write(iteratorResult.value, cb)

      if (!isOk) {
        log('backpressure at %d', i)
      }

      return isOk
    }
    const eagerWriter = () => {
      log('eager writing begin at %d', i)

      // eslint-disable-next-line no-empty
      while (writeChunk()) {}

      log('eager writing done at %d', i)
    }
    const lazyWriter = (err?: Error) => {
      if (err) {
        log('callback got error at %d: %s', i, err && err.message)

        if (!continueOnError) {
          // eslint-disable-next-line no-use-before-define
          unsubscribe()
        }
      }

      log('lazy writing begin at %d', i)
      writeChunk(lazyWriter)
      log('lazy writing done at %d', i)
    }
    const onDrainEvent = () => {
      log('received \'drain\' event %d', i)
      eager ? eagerWriter() : lazyWriter()
    }
    const onErrorEvent = (err?: Error) => {
      log('received \'error\' event %d: %s', i, err && err.message)

      if (!continueOnError) {
        // eslint-disable-next-line no-use-before-define
        unsubscribe()
      }
    }
    const unsubscribe = () => {
      log('unsubscribe')
      done = true
      stream.removeListener('drain', onDrainEvent)
      stream.removeListener('finish', unsubscribe)
      stream.removeListener('error', onErrorEvent)
    }

    return () => {
      /* subscribe */
      log('producer subscribe')
      stream.on('drain', onDrainEvent)
      stream.on('finish', unsubscribe)
      stream.on('error', onErrorEvent)
      /* drain event could already be emitted, try to write once */

      setImmediate(eager ? eagerWriter : lazyWriter)

      return unsubscribe
    }
  }


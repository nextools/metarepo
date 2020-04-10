import { Stream } from 'stream'
import { waitTimePromise } from '@psxcode/wait'

export const makeNumbers = (length: number): Iterable<number> => ({
  *[Symbol.iterator]() {
    for (let i = 0; i < length; ++i) {
      yield i
    }
  },
})

export const makeStrings = (length: number): Iterable<string> => ({
  *[Symbol.iterator]() {
    for (let i = 0; i < length; ++i) {
      yield `#${`${i}`.padStart(7, '0')}`
    }
  },
})

export const numEvents = (...ees: NodeJS.EventEmitter[]) => {
  let num = 0

  for (const ee of ees) {
    num += ee.listenerCount('data')
    num += ee.listenerCount('readable')
    num += ee.listenerCount('error')
    num += ee.listenerCount('end')
    num += ee.listenerCount('finish')
    num += ee.listenerCount('close')
  }

  return num
}

export const printEvents = (...ees: NodeJS.EventEmitter[]) => {
  let str = ''

  for (let i = 0; i < ees.length; ++i) {
    const ee = ees[i]

    str += `emitter_${i}\n`
    str += `- data:\t\t${ee.listenerCount('data')}\n`
    str += `- readable:\t${ee.listenerCount('readable')}\n`
    str += `- error:\t${ee.listenerCount('error')}\n`
    str += `- end:\t\t${ee.listenerCount('end')}\n`
    str += `- finish:\t${ee.listenerCount('finish')}\n`
    str += `- close:\t${ee.listenerCount('close')}\n\n`
  }

  return str
}

export const finished = async (stream: Stream) => {
  await new Promise((resolve) => {
    const unsub = () => {
      stream.removeListener('end', unsub)
      stream.removeListener('finish', unsub)
      stream.removeListener('close', unsub)

      resolve()
    }

    stream.addListener('end', unsub)
    stream.addListener('finish', unsub)
    stream.addListener('close', unsub)
  })

  await waitTimePromise(10)
}

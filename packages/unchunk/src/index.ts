import { EventEmitter } from 'events'

export const unchunkBuffer = (emitter: EventEmitter): Promise<Buffer> => {
  let result = Buffer.alloc(0)

  return new Promise((resolve, reject) => {
    emitter
      .on('error', reject)
      .on('data', (chunk: Buffer) => {
        result = Buffer.concat([result, chunk])
      })
      .on('end', () => {
        resolve(result)
      })
  })
}

export const unchunkString = async (emitter: EventEmitter): Promise<string> => {
  const buf = await unchunkBuffer(emitter)

  return buf.toString('utf8')
}

type TAnyObject = {
  [k: string]: any,
}

export const unchunkJson = async <T = TAnyObject>(emitter: EventEmitter): Promise<T> => {
  const str = await unchunkString(emitter)

  return JSON.parse(str)
}

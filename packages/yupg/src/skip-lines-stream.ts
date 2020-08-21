import { Transform } from 'stream'

export const skipLinesStream = (depName: string): Transform => {
  let isSkipping = false

  return new Transform({
    transform(chunk: Buffer, _, callback) {
      const chunkString = chunk.toString('utf8')

      if (isSkipping) {
        if (chunkString.startsWith('"')) {
          isSkipping = false
        }
      } else if (chunkString.startsWith(`"${depName}@`)) {
        isSkipping = true
      }

      if (!isSkipping) {
        this.push(chunk)
      }

      callback()
    },
  })
}

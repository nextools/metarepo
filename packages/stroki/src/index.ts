import { EOL } from 'os'
import { Transform } from 'stream'

export const lineStream = (): Transform => {
  let tempString = ''

  return new Transform({
    transform(chunk: Buffer, encoding, callback) {
      const chunkString = chunk.toString('utf8')
      const newlineIndex = chunkString.indexOf(EOL)

      if (newlineIndex >= 0) {
        tempString += chunkString.substring(0, newlineIndex)

        this.push(`${tempString}${EOL}`)

        tempString = ''

        if (newlineIndex < chunkString.length - EOL.length) {
          return this._transform(chunkString.substring(newlineIndex + EOL.length), encoding, callback)
        }
      } else {
        tempString += chunkString
      }

      callback()
    },

    flush(callback) {
      if (tempString.length > 0) {
        this.push(tempString)
      }

      callback()
    },
  })
}

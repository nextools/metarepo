import { Transform } from 'stream'
import replaceString from 'replace-string'

export const replaceStream = (searchValue: RegExp | string, replaceValue: string): Transform => {
  return new Transform({
    transform(chunk: Buffer, _, callback) {
      const chunkString = chunk.toString('utf8')

      if (typeof searchValue === 'string') {
        this.push(replaceString(chunkString, searchValue, replaceValue))
      } else {
        this.push(chunkString.replace(searchValue, replaceValue))
      }

      callback()
    },
  })
}

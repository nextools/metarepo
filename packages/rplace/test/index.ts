import { Readable } from 'stream'
import test from 'tape'
import { unchunkString } from 'unchunk'
import { replaceStream } from '../src'

test('rplace: string', async (t) => {
  const readable = new Readable({
    read() {
      this.push('replace 1 replace 2')
      this.push(null)
    },
  })

  const result = await unchunkString(
    readable.pipe(replaceStream('replace', 'done'))
  )

  t.equal(
    result,
    'done 1 done 2',
    'should replace'
  )
})

test('rplace: regexp', async (t) => {
  const readable = new Readable({
    read() {
      this.push('replace 1 replace 2')
      this.push(null)
    },
  })

  const result = await unchunkString(
    readable.pipe(replaceStream(/replace (\d)/g, '$1 done'))
  )

  t.equal(
    result,
    '1 done 2 done',
    'should replace'
  )
})

import { Readable } from 'stream'
import test from 'blue-tape'
import { replaceStream } from '../src'

test('rplace: regexp + no trailing newline (flush)', (t) => {
  const readable = new Readable({
    read() {
      this.push('replace 1 replace 2\nreplace 3\nreplace 4')
      this.push(null)
    },
  })

  let tempBuffer = Buffer.alloc(0)

  readable
    .pipe(replaceStream(/replace (\d)/g, '$1 replace'))
    .pipe(replaceStream('replace', 'done'))
    .on('data', (chunk) => {
      tempBuffer = Buffer.concat([tempBuffer, chunk])
    })
    .on('end', () => {
      t.equals(
        tempBuffer.toString('utf8'),
        '1 done 2 done\n3 done\n4 done',
        'should replace'
      )

      t.end()
    })
})

test('rplace: trailing newline', (t) => {
  const readable = new Readable({
    read() {
      this.push('replace 1 replace 2\nreplace 3\nreplace 4\n')
      this.push(null)
    },
  })

  let tempBuffer = Buffer.alloc(0)

  readable
    .pipe(replaceStream(/replace (\d)/g, '$1 replace'))
    .pipe(replaceStream('replace', 'done'))
    .on('data', (chunk) => {
      tempBuffer = Buffer.concat([tempBuffer, chunk])
    })
    .on('end', () => {
      t.equals(
        tempBuffer.toString('utf8'),
        '1 done 2 done\n3 done\n4 done\n',
        'should replace'
      )

      t.end()
    })
})

test('rplace: partialy chunked', (t) => {
  let index = 0
  const lines = [
    'replace 1 repla',
    'ce 2\nreplace 3\n',
    'replace 4',
    '\n',
  ]

  const readable = new Readable({
    read() {
      if (index >= lines.length) {
        this.push(null)
      } else {
        this.push(lines[index++])
      }
    },
  })

  let tempBuffer = Buffer.alloc(0)

  readable
    .pipe(replaceStream(/replace (\d)/g, '$1 replace'))
    .pipe(replaceStream('replace', 'done'))
    .on('data', (chunk) => {
      tempBuffer = Buffer.concat([tempBuffer, chunk])
    })
    .on('end', () => {
      t.equals(
        tempBuffer.toString('utf8'),
        '1 done 2 done\n3 done\n4 done\n',
        'should replace'
      )

      t.end()
    })
})

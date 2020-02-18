import { Readable } from 'stream'
import test from 'blue-tape'
import { replaceStream } from '../src'

test('rplace: no trailing newline (flush)', (t) => {
  const readable = new Readable({
    read() {
      this.push('line 1\nline 2\nline 3')
      this.push(null)
    },
  })

  let tempBuffer = Buffer.alloc(0)

  readable
    .pipe(replaceStream(/^line (\d)$/, '$1 line'))
    .on('data', (chunk) => {
      tempBuffer = Buffer.concat([tempBuffer, chunk])
    })
    .on('end', () => {
      t.equals(
        tempBuffer.toString('utf8'),
        '1 line\n2 line\n3 line',
        'should replace'
      )

      t.end()
    })
})

test('rplace: trailing newline', (t) => {
  const readable = new Readable({
    read() {
      this.push('line 1\nline 2\nline 3\n')
      this.push(null)
    },
  })

  let tempBuffer = Buffer.alloc(0)

  readable
    .pipe(replaceStream(/^line (\d)$/, '$1 line'))
    .on('data', (chunk) => {
      tempBuffer = Buffer.concat([tempBuffer, chunk])
    })
    .on('end', () => {
      t.equals(
        tempBuffer.toString('utf8'),
        '1 line\n2 line\n3 line\n',
        'should replace'
      )

      t.end()
    })
})

test('rplace: partialy chunked', (t) => {
  let index = 0
  const lines = [
    'line ',
    '1\nline 2\n',
    'line 3',
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
    .pipe(replaceStream(/^line (\d)$/, '$1 line'))
    .on('data', (chunk) => {
      tempBuffer = Buffer.concat([tempBuffer, chunk])
    })
    .on('end', () => {
      t.equals(
        tempBuffer.toString('utf8'),
        '1 line\n2 line\n3 line\n',
        'should replace'
      )

      t.end()
    })
})

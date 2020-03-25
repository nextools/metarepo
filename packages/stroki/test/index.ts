import { Readable } from 'stream'
import test from 'tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock } from 'mocku'

test('stroki: empty stream', async (t) => {
  const readable = new Readable({
    read() {
      this.push(null)
    },
  })

  const spy = createSpy(() => {})

  const { lineStream } = await import('../src')

  await new Promise((resolve, reject) => {
    readable
      .pipe(lineStream())
      .on('data', (chunk: Buffer) => {
        spy(chunk.toString('utf8'))
      })
      .on('error', reject)
      .on('end', resolve)
  })

  t.deepEqual(
    getSpyCalls(spy),
    [],
    'should end'
  )
})

const eols = ['\n', '\r\n']

for (const eol of eols) {
  const escapedEol = eol.replace('\n', '\\n').replace('\r', '\\r')

  test(`stroki: ${escapedEol} + no trailing newline (flush)`, async (t) => {
    const readable = new Readable({
      read() {
        this.push(`data 1 data 2${eol}data 3${eol}data 4`)
        this.push(null)
      },
    })

    const spy = createSpy(() => {})
    const unmock = mock('../src', {
      os: {
        EOL: eol,
      },
    })

    const { lineStream } = await import('../src')

    await new Promise((resolve, reject) => {
      readable
        .pipe(lineStream())
        .on('data', (chunk: Buffer) => {
          spy(chunk.toString('utf8'))
        })
        .on('error', reject)
        .on('end', resolve)
    })

    unmock()

    t.deepEqual(
      getSpyCalls(spy),
      [
        [`data 1 data 2${eol}`],
        [`data 3${eol}`],
        ['data 4'],
      ],
      'should read line by line'
    )
  })

  test(`stroki: ${escapedEol} + leading + trailing newline`, async (t) => {
    const readable = new Readable({
      read() {
        this.push(`${eol}${eol}data 1 data 2${eol}data 3${eol}data 4${eol}${eol}${eol}`)
        this.push(null)
      },
    })

    const spy = createSpy(() => {})
    const unmock = mock('../src', {
      os: {
        EOL: eol,
      },
    })

    const { lineStream } = await import('../src')

    await new Promise((resolve, reject) => {
      readable
        .pipe(lineStream())
        .on('data', (chunk: Buffer) => {
          spy(chunk.toString('utf8'))
        })
        .on('error', reject)
        .on('end', resolve)
    })

    unmock()

    t.deepEqual(
      getSpyCalls(spy),
      [
        [eol],
        [eol],
        [`data 1 data 2${eol}`],
        [`data 3${eol}`],
        [`data 4${eol}`],
        [eol],
        [eol],
      ],
      'should read line by line'
    )
  })

  test(`stroki: ${escapedEol} + partialy chunked`, async (t) => {
    let index = 0
    const lines = [
      'data 1 da',
      `ta 2${eol}data 3${eol}da`,
      'ta',
      ' 4',
      eol,
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

    const spy = createSpy(() => {})
    const unmock = mock('../src', {
      os: {
        EOL: eol,
      },
    })

    const { lineStream } = await import('../src')

    await new Promise((resolve, reject) => {
      readable
        .pipe(lineStream())
        .on('data', (chunk: Buffer) => {
          spy(chunk.toString('utf8'))
        })
        .on('error', reject)
        .on('end', resolve)
    })

    unmock()

    t.deepEqual(
      getSpyCalls(spy),
      [
        [`data 1 data 2${eol}`],
        [`data 3${eol}`],
        [`data 4${eol}`],
      ],
      'should read line by line'
    )
  })

  test(`stroki: ${escapedEol} + only newline`, async (t) => {
    const readable = new Readable({
      read() {
        this.push(eol)
        this.push(null)
      },
    })

    const spy = createSpy(() => {})
    const unmock = mock('../src', {
      os: {
        EOL: eol,
      },
    })

    const { lineStream } = await import('../src')

    await new Promise((resolve, reject) => {
      readable
        .pipe(lineStream())
        .on('data', (chunk: Buffer) => {
          spy(chunk.toString('utf8'))
        })
        .on('error', reject)
        .on('end', resolve)
    })

    unmock()

    t.deepEqual(
      getSpyCalls(spy),
      [
        [eol],
      ],
      'should read line by line'
    )
  })
}

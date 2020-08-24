/* eslint-disable node/no-sync */
import { mockFs } from '@mock/fs'
import type { IFs } from 'memfs'
import { replaceStream } from 'rplace'
import test from 'tape'

const mockFsRead = (fs: IFs) => {
  const origRead = fs.read

  // eslint-disable-next-line max-params
  fs.read = ((fd: number, buffer: Buffer | Uint8Array, offset: number, length: number, position: number, callback: (err?: Error | null, result?: {bytesRead?: number}) => void) => {
    return origRead(fd, buffer, offset, length, position, (err, bytesRead) => callback(err, { bytesRead }))
  }) as any
}

test('rwrw: default', async (t) => {
  const { fs, unmockFs } = mockFs('../src')
  const filePath = '/test.txt'

  try {
    mockFsRead(fs)
    fs.writeFileSync(filePath, 'hello')

    const { rewriteStream } = await import('../src')
    const { readableStream, writableStream } = await rewriteStream(filePath)

    await new Promise((resolve, reject) => {
      writableStream
        .on('finish', resolve)
        .on('error', reject)

      readableStream
        .on('error', reject)
        .pipe(replaceStream('he', 'world'))
        .on('error', reject)
        .pipe(writableStream)
        .on('error', reject)
    })

    t.equals(
      fs.readFileSync(filePath, 'utf8'),
      'worldllo',
      'should replace'
    )
  } finally {
    unmockFs()
  }
})

test('rwrw: highWatermark', async (t) => {
  const { fs, unmockFs } = mockFs('../src')
  const filePath = '/test.txt'

  try {
    mockFsRead(fs)
    fs.writeFileSync(filePath, 'hellohellohello')

    const { rewriteStream } = await import('../src')
    const { readableStream, writableStream } = await rewriteStream(filePath, { highWatermark: 10 })

    let readCount = 0

    await new Promise((resolve, reject) => {
      writableStream
        .on('finish', resolve)
        .on('error', reject)

      readableStream
        .on('data', () => {
          readCount++
        })
        .on('error', reject)
        .pipe(replaceStream('he', 'HEHE'))
        .on('error', reject)
        .pipe(writableStream)
        .on('error', reject)
    })

    t.equals(
      readCount,
      2,
      'should call data exact times'
    )

    t.equals(
      fs.readFileSync(filePath, 'utf8'),
      'HEHElloHEHElloHEHEllo',
      'should replace'
    )
  } finally {
    unmockFs()
  }
})

test('rwrw: smaller file write', async (t) => {
  const { fs, unmockFs } = mockFs('../src')
  const filePath = '/test.txt'

  try {
    mockFsRead(fs)
    fs.writeFileSync(filePath, 'hellohellohello')

    const { rewriteStream } = await import('../src')
    const { readableStream, writableStream } = await rewriteStream(filePath)

    await new Promise((resolve, reject) => {
      writableStream
        .on('finish', resolve)
        .on('error', reject)

      readableStream
        .on('error', reject)
        .pipe(replaceStream('hello', 'HE'))
        .on('error', reject)
        .pipe(writableStream)
        .on('error', reject)
    })

    t.equals(
      fs.readFileSync(filePath, 'utf8'),
      'HEHEHE',
      'should replace'
    )
  } finally {
    unmockFs()
  }
})

test('rwrw: read error', async (t) => {
  const { fs, unmockFs } = mockFs('../src')
  const filePath = '/test.txt'

  try {
    mockFsRead(fs)
    fs.writeFileSync(filePath, 'hello')

    fs.read = () => {
      throw new Error('read error')
    }

    const { rewriteStream } = await import('../src')
    const { readableStream, writableStream } = await rewriteStream(filePath)

    try {
      await new Promise((resolve, reject) => {
        writableStream
          .on('finish', resolve)
          .on('error', reject)

        readableStream
          .on('error', reject)
          .pipe(writableStream)
      })

      t.fail()
    } catch (e) {
      t.equals(
        e.message,
        'read error',
        'should handle error'
      )
    }
  } finally {
    unmockFs()
  }
})

test('rwrw: write error', async (t) => {
  const { fs, unmockFs } = mockFs('../src')
  const filePath = '/test.txt'

  try {
    mockFsRead(fs)
    fs.writeFileSync(filePath, 'hello')

    fs.write = () => {
      throw new Error('write error')
    }

    const { rewriteStream } = await import('../src')
    const { readableStream, writableStream } = await rewriteStream(filePath)

    try {
      await new Promise((resolve, reject) => {
        writableStream
          .on('finish', resolve)
          .on('error', reject)

        readableStream
          .on('error', reject)
          .pipe(writableStream)
      })

      t.fail()
    } catch (e) {
      t.equals(
        e.message,
        'write error',
        'should handle error'
      )
    }
  } finally {
    unmockFs()
  }
})

test('rwrw: open error', async (t) => {
  const { fs, unmockFs } = mockFs('../src')
  const filePath = '/test.txt'

  try {
    mockFsRead(fs)
    fs.writeFileSync(filePath, 'hello')

    fs.open = () => {
      throw new Error('open error')
    }

    const { rewriteStream } = await import('../src')

    try {
      const { readableStream, writableStream } = await rewriteStream(filePath)

      await new Promise((resolve, reject) => {
        writableStream
          .on('finish', resolve)
          .on('error', reject)

        readableStream
          .on('error', reject)
          .pipe(writableStream)
      })

      t.fail()
    } catch (e) {
      t.equals(
        e.message,
        'open error',
        'should handle error'
      )
    }
  } finally {
    unmockFs()
  }
})

test('rwrw: close error', async (t) => {
  const { fs, unmockFs } = mockFs('../src')
  const filePath = '/test.txt'

  try {
    mockFsRead(fs)
    fs.writeFileSync(filePath, 'hello')

    fs.close = () => {
      throw new Error('close error')
    }

    const { rewriteStream } = await import('../src')
    const { readableStream, writableStream } = await rewriteStream(filePath)

    try {
      await new Promise((resolve, reject) => {
        writableStream
          .on('finish', resolve)
          .on('error', reject)

        readableStream
          .on('error', reject)
          .pipe(writableStream)
      })

      t.fail()
    } catch (e) {
      t.equals(
        e.message,
        'close error',
        'should handle error'
      )
    }
  } finally {
    unmockFs()
  }
})

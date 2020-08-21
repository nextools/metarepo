import { Readable, Writable } from 'stream'
import fs from 'pifs'

export type TRewriteStream = {
  highWatermark?: number,
}

export const rewriteStream = async (filePath: string, options?: TRewriteStream) => {
  const fd = await fs.open(filePath, 'r+')

  let readOffset = 0
  let writeOffset = 0
  let isEOF = false

  let writeCb: ((error?: Error | null) => void) | null = null
  let writeChunk: Buffer | null = null

  const tryWrite = async () => {
    if (writeCb === null || writeChunk === null) {
      return
    }

    const length = Buffer.byteLength(writeChunk)

    if (!isEOF && writeOffset + length > readOffset) {
      return
    }

    const cb = writeCb
    const chunk = writeChunk
    const offset = writeOffset

    writeCb = null
    writeChunk = null
    writeOffset += length

    await fs.write(fd, chunk, 0, length, offset)

    cb()
  }

  const readableStream = new Readable({
    async read(size) {
      try {
        const buf = Buffer.alloc(size)
        const { bytesRead } = await fs.read(fd, buf, 0, size, readOffset)

        isEOF = bytesRead < size
        readOffset += bytesRead

        if (isEOF) {
          this.push(buf.slice(0, bytesRead))
          this.push(null)
        } else {
          this.push(buf)
        }

        await tryWrite()
      } catch (e) {
        this.emit('error', e)
      }
    },
    highWaterMark: options?.highWatermark,
  })

  const writableStream = new Writable({
    async write(chunk, _, cb) {
      try {
        writeChunk = chunk
        writeCb = cb

        await tryWrite()
      } catch (e) {
        this.emit('error', e)
      }
    },
    async final(cb) {
      try {
        if (readOffset > writeOffset) {
          await fs.ftruncate(fd, writeOffset)
        }

        await fs.close(fd)
        cb()
      } catch (e) {
        this.emit('error', e)
      }
    },
    highWaterMark: options?.highWatermark,
  })

  return {
    readableStream,
    writableStream,
  }
}

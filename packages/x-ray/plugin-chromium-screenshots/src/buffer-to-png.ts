import { PNG } from 'pngjs'
import type { PNGWithMetadata } from 'pngjs'

export const bufferToPng = (buf: Buffer): PNGWithMetadata => PNG.sync.read(buf)

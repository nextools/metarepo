import { PNG, PNGWithMetadata } from 'pngjs'

export const bufferToPng = (buf: Buffer): PNGWithMetadata => PNG.sync.read(buf)

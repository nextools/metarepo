import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

export const hasScreenshotDiff = (a: Buffer, b: Buffer): boolean => {
  const pngA = PNG.sync.read(a)
  const pngB = PNG.sync.read(b)

  if (pngA.width !== pngB.width || pngA.height !== pngB.height) {
    return true
  }

  const diffPixelAmount = pixelmatch(
    pngA.data,
    pngB.data,
    null,
    pngB.width,
    pngB.height
  )

  return diffPixelAmount > 0
}

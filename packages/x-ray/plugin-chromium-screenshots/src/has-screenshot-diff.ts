import pixelmatch from 'pixelmatch'
import type { PNGWithMetadata } from 'pngjs'

export const hasScreenshotDiff = (pngA: PNGWithMetadata, pngB: PNGWithMetadata): boolean => {
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

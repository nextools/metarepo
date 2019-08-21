import pixelmatch from 'pixelmatch'
import { Image, toRGBA8 } from 'upng-js'

export const hasPngDiff = (pngA: Image, pngB: Image) => {
  if (pngA.width !== pngB.width || pngA.height !== pngB.height) {
    return true
  }

  const diffPixels = pixelmatch(
    new Uint8Array(toRGBA8(pngA)[0]),
    new Uint8Array(toRGBA8(pngB)[0]),
    null,
    pngB.width,
    pngB.height
  )

  return diffPixels > 0
}

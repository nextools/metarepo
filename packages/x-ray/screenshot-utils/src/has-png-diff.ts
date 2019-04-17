import pixelmatch from 'pixelmatch'
import upng from 'upng-js'

const hasPngDiff = (a: Buffer, b: Buffer) => {
  const pngA = upng.decode(a)
  const pngB = upng.decode(b)

  if (pngA.width !== pngB.width || pngA.height !== pngB.height) {
    return true
  }

  const diffPixels = pixelmatch(
    new Uint8Array(upng.toRGBA8(pngA)[0]),
    new Uint8Array(upng.toRGBA8(pngB)[0]),
    null,
    pngB.width,
    pngB.height
  )

  return diffPixels > 0
}

export default hasPngDiff

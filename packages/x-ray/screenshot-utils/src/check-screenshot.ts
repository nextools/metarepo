// @ts-ignore
import imageminPngout from 'imagemin-pngout'
import { TTarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import upng from 'upng-js'
import { TScreenshotsCheckResult } from './types'
import { hasPngDiff } from './has-png-diff'

const optimizePng = imageminPngout({ strategy: 2 })

export const checkScreenshot = async (data: Buffer, tar: TTarFs, screenshotName: string): Promise<TScreenshotsCheckResult> => {
  if (tar.has(screenshotName)) {
    const { data: existingData } = await tar.read(screenshotName) as TTarDataWithMeta

    const pngOld = upng.decode(existingData)
    const pngNew = upng.decode(data)

    if (!hasPngDiff(pngOld, pngNew)) {
      return {
        type: 'OK',
      }
    }

    const optimizedScreenshot = await optimizePng(data)

    return {
      type: 'DIFF',
      old: {
        data: existingData,
        width: pngOld.width,
        height: pngOld.height,
      },
      new: {
        data: optimizedScreenshot,
        width: pngNew.width,
        height: pngNew.height,
      },
    }
  }

  const pngNew = upng.decode(data)
  const optimizedScreenshot = await optimizePng(data)

  return {
    type: 'NEW',
    data: optimizedScreenshot,
    width: pngNew.width,
    height: pngNew.height,
  }
}

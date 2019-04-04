import { promisify } from 'util'
import fs from 'graceful-fs'
// @ts-ignore
import imageminPngout from 'imagemin-pngout'
import { TCheckResult } from '@x-ray/common-utils'
import hasPngDiff from './has-png-diff'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const pathExists = promisify(fs.access)
const optimizePng = imageminPngout({ strategy: 2 })

const checkScreenshot = async (data: Buffer, screenshotPath: string, shouldBailout: boolean): Promise<TCheckResult> => {
  let screenshotExists = false

  try {
    await pathExists(screenshotPath)

    screenshotExists = true
  } catch (e) {
    //
  }

  if (screenshotExists) {
    const existingData = await readFile(screenshotPath)

    if (!hasPngDiff(existingData, data)) {
      return {
        status: 'ok',
        path: screenshotPath,
      }
    }

    if (shouldBailout) {
      return {
        status: 'diff',
        path: screenshotPath,
      }
    }

    const optimizedScreenshot = await optimizePng(data)
    await writeFile(screenshotPath, optimizedScreenshot)

    return {
      status: 'diff',
      path: screenshotPath,
    }
  }

  if (shouldBailout) {
    return {
      status: 'unknown',
      path: screenshotPath,
    }
  }

  const optimizedScreenshot = await optimizePng(data)
  await writeFile(screenshotPath, optimizedScreenshot)

  return {
    status: 'new',
    path: screenshotPath,
  }
}

export default checkScreenshot

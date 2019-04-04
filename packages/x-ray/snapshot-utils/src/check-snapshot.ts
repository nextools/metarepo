import { promisify } from 'util'
import fs from 'graceful-fs'
import { TCheckResult } from '@x-ray/common-utils'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const pathExists = promisify(fs.access)

const checkSnapshot = async (data: any, snapshotPath: string, shouldBailout: boolean): Promise<TCheckResult> => {
  try {
    await pathExists(snapshotPath)
    const existingData = await readFile(snapshotPath, 'utf8')

    if (data === existingData) {
      return {
        status: 'ok',
        path: snapshotPath,
      }
    }

    if (shouldBailout) {
      return {
        status: 'diff',
        path: snapshotPath,
      }
    }

    await writeFile(snapshotPath, data, 'utf8')

    return {
      status: 'diff',
      path: snapshotPath,
    }
  } catch (e) {
    //
  }

  if (shouldBailout) {
    return {
      status: 'unknown',
      path: snapshotPath,
    }
  }

  await writeFile(snapshotPath, data, 'utf8')

  return {
    status: 'new',
    path: snapshotPath,
  }
}

export default checkSnapshot

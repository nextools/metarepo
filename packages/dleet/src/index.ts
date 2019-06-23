/* eslint-disable no-use-before-define */
import { chmod, lstat, readdir, rmdir, unlink } from 'fs'
import { promisify } from 'util'
import { join } from 'path'
import { delay } from './delay'

const EBUSY_MAX_TRIES = 3
const EBUSY_RETRY_DELAY = 100
const CHMOD_RWRWRW = 0o666
const IS_WINDOWS = process.platform === 'win32'

const pChmod = promisify(chmod)
const pLstat = promisify(lstat)
const pReaddir = promisify(readdir)
const pRmdir = promisify(rmdir)
const pUnlink = promisify(unlink)

const rm = async (targetPath: string): Promise<void> => {
  const stats = await pLstat(targetPath)

  if (stats.isDirectory()) {
    const list = await pReaddir(targetPath)

    await Promise.all(
      list
        .map((item) => join(targetPath, item))
        .map(dleet)
    )
    await pRmdir(targetPath)
  } else {
    await pUnlink(targetPath)
  }
}

const dleet = async (targetPath: string) => {
  let ebusyTries = 1
  let hasFixedMode = false

  const tryToRm = async () => {
    try {
      await rm(targetPath)
    } catch (error) {
      // "operation not permitted", make target writable and try again
      if (IS_WINDOWS && error.code === 'EPERM') {
        if (hasFixedMode) {
          throw error
        }

        hasFixedMode = true

        await pChmod(targetPath, CHMOD_RWRWRW)
        await tryToRm()
      // target is busy or locked, wait and try again few times
      } else if (IS_WINDOWS && error.code === 'EBUSY') {
        if (ebusyTries === EBUSY_MAX_TRIES) {
          throw error
        }

        ebusyTries += 1

        await delay(EBUSY_RETRY_DELAY)
        await tryToRm()
      // ignore "no such file or directory", it's a good result too
      } else if (error.code !== 'ENOENT') {
        throw error
      }
    }
  }

  await tryToRm()
}

export default dleet

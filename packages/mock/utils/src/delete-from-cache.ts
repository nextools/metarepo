import path from 'path'
import getCallerFile from 'get-caller-file'
import { uncacheKey } from './uncache-key'

export const deleteFromCache = (file: string): void => {
  const callerFile = getCallerFile()
  const callerDir = path.dirname(callerFile)
  let fullPath = file

  if (!path.isAbsolute(file)) {
    const targetPath = path.join(callerDir, file)

    fullPath = require.resolve(targetPath)
  }

  uncacheKey(fullPath)
}

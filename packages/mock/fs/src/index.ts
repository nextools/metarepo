import path from 'path'
import { mockRequire } from '@mock/require'
import { Volume, createFsFromVolume, IFs } from 'memfs'
import getCallerFile from 'get-caller-file'

export const mockFs = (file: string): { fs: IFs, unmockFs: () => void } => {
  const vol = new Volume()
  const fs = createFsFromVolume(vol)

  let fullFilePath = file

  if (!path.isAbsolute(file)) {
    const callerDir = path.dirname(getCallerFile())
    const targetPath = path.resolve(callerDir, file)

    fullFilePath = require.resolve(targetPath)
  }

  const unmockImport = mockRequire(fullFilePath, { fs })

  return {
    fs,
    unmockFs: () => {
      unmockImport()
      vol.reset()
    },
  }
}

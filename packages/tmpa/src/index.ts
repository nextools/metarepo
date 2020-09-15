import { tmpdir } from 'os'
import path from 'path'
import { nanoid } from 'nanoid'
import { realpath, mkdir } from 'pifs'

let sysTempDirPath: string

const getSysTempDirPath = async (): Promise<string> => {
  sysTempDirPath = sysTempDirPath ?? await realpath(tmpdir())

  return sysTempDirPath
}

export const getTempFilePath = async (extension?: string): Promise<string> => {
  const sysTempDirPath = await getSysTempDirPath()
  const uid = nanoid(32)
  let tempFilePath = path.join(sysTempDirPath, uid)

  if (typeof extension === 'string') {
    tempFilePath += `.${extension}`
  }

  return tempFilePath
}

export const getTempDirPath = async (prefix?: string): Promise<string> => {
  const sysTempDirPath = await getSysTempDirPath()
  let uid = nanoid(32)

  if (typeof prefix === 'string') {
    uid = `${prefix}${uid}`
  }

  const tempDirPath = path.join(sysTempDirPath, uid)

  await mkdir(tempDirPath)

  return tempDirPath
}

import { TTarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import { TSnapshotsCheckResult } from './types'

export const checkSnapshot = async (data: Buffer, tar: TTarFs, snapshotName: string): Promise<TSnapshotsCheckResult> => {
  if (tar.has(snapshotName)) {
    const { data: existingData } = await tar.read(snapshotName) as TTarDataWithMeta

    if (existingData === null) {
      throw new Error(`Unable to read file "${snapshotName}"`)
    }

    if (Buffer.compare(data, existingData) === 0) {
      return {
        type: 'OK',
      }
    }

    return {
      type: 'DIFF',
      oldData: existingData,
      newData: data,
    }
  }

  return {
    type: 'NEW',
    data,
  }
}

import { TSnapshotsListResult } from '@x-ray/snapshots'
import { TScreenshotsListResult } from '@x-ray/screenshot-utils'
import { HOST, PORT } from '../config'

export type TApiLoadListResult = TSnapshotsListResult | TScreenshotsListResult

export const apiLoadList = async (): Promise<TApiLoadListResult> => {
  const response = await fetch(`http://${HOST}:${PORT}/list`)

  if (!response.ok) {
    throw new Error(`Load list (${response.status}): ${response.statusText}`)
  }

  return response.json()
}

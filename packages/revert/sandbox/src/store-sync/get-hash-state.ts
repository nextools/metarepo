import type { TAnyObject } from 'tsfn'
import { decodeUrl } from '../utils'
import { getCurrentHash, EMPTY_HASH } from '../utils/get-current-hash'
import { getInitialSyncState } from './get-initial-sync-state'

export const getHashState = (): TAnyObject => {
  const hash = getCurrentHash()

  return hash === EMPTY_HASH
    ? getInitialSyncState()
    : decodeUrl(hash)
}

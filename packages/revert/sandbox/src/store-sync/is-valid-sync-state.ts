import { isObject } from 'tsfn'
import { mainStateKeys, metaStateKeys } from './get-initial-sync-state'
import type { TSyncState } from './types'

export const isValidSyncState = (obj: any): obj is TSyncState =>
  isObject(obj) &&
  mainStateKeys.every((k) => Reflect.has(obj, k)) &&
  metaStateKeys.every((k) => Reflect.has(obj, k))

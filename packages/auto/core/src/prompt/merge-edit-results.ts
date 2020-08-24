import type { TReadonly } from 'tsfn'
import type { TPromptEditData } from '../types'
import { makeEmptyEditData } from '../utils'

const mergeArrayUnique = <T>(a: readonly T[] = [], b: readonly T[]): T[] => {
  return Array.from(new Set(a.concat(b)))
}

export const mergeEditResults = (prev: TReadonly<TPromptEditData>, next: TReadonly<TPromptEditData>): TPromptEditData => {
  const res: TPromptEditData = makeEmptyEditData()

  // INITIAL
  for (const [k, v] of prev.initialTypeOverrideMap) {
    res.initialTypeOverrideMap.set(k, v)
  }

  for (const [k, v] of next.initialTypeOverrideMap) {
    res.initialTypeOverrideMap.set(k, v)
  }

  // ZERO BREAKING
  for (const [k, v] of prev.zeroBreakingTypeOverrideMap) {
    res.zeroBreakingTypeOverrideMap.set(k, v)
  }

  for (const [k, v] of next.zeroBreakingTypeOverrideMap) {
    res.zeroBreakingTypeOverrideMap.set(k, v)
  }

  // DEPENDENCY MAP
  for (const [k, v] of prev.dependencyBumpIgnoreMap) {
    res.dependencyBumpIgnoreMap.set(k, v.slice())
  }

  for (const [k, v] of next.dependencyBumpIgnoreMap) {
    res.dependencyBumpIgnoreMap.set(k, mergeArrayUnique(res.dependencyBumpIgnoreMap.get(k), v))
  }

  return res
}

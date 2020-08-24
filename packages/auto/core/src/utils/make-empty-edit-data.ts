import type { TPromptEditData } from '../types'

export const makeEmptyEditData = (): TPromptEditData => ({
  dependencyBumpIgnoreMap: new Map(),
  initialTypeOverrideMap: new Map(),
  zeroBreakingTypeOverrideMap: new Map(),
})

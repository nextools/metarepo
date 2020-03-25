import { TReadonly } from 'tsfn'
import { TPromptEditData, TResolvedReleaseType } from '../types'

export type TQuestionObj = {
  dependencyBumps?: {
    [name: string]: {
      [name: string]: string,
    },
  },
  initialTypes?: {
    [name: string]: TResolvedReleaseType,
  },
  zeroBreakingTypes?: {
    [name: string]: TResolvedReleaseType,
  },
}

export type TPromptEditResult = {
  type: 'EDIT',
} & TReadonly<TPromptEditData>

export type TPromptResult = {
  type: 'YES' | 'NO',
} | TPromptEditResult

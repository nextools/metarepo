import type { TPromptEditData } from '../types'
import { isResolvedReleaseType, makeEmptyEditData } from '../utils'
import type { TQuestionObj } from './types'

const makeQuestionReqired = (q: TQuestionObj): Required<TQuestionObj> => {
  const result: Required<TQuestionObj> = {
    initialTypes: {
      ...q.initialTypes,
    },
    dependencyBumps: {
      ...q.dependencyBumps,
    },
    zeroBreakingTypes: {
      ...q.zeroBreakingTypes,
    },
  }

  return result
}

export const answerToEditResult = (question: TQuestionObj, answer: TQuestionObj): TPromptEditData => {
  const result: TPromptEditData = makeEmptyEditData()

  const rQ = makeQuestionReqired(question)
  const rA = makeQuestionReqired(answer)

  for (const name of Object.keys(rA.initialTypes)) {
    const aType = rA.initialTypes[name]

    if (isResolvedReleaseType(aType) && Reflect.has(rQ.initialTypes, name) && rQ.initialTypes[name] !== aType) {
      result.initialTypeOverrideMap.set(name, aType)
    }
  }

  for (const name of Object.keys(rA.zeroBreakingTypes)) {
    const aType = rA.zeroBreakingTypes[name]

    if (isResolvedReleaseType(aType) && Reflect.has(rQ.zeroBreakingTypes, name) && rQ.zeroBreakingTypes[name] !== aType) {
      result.zeroBreakingTypeOverrideMap.set(name, aType)
    }
  }

  for (const name of Object.keys(rQ.dependencyBumps)) {
    const qDepNames = Object.keys(rQ.dependencyBumps[name])
    const aDepNames = Object.keys(rA.dependencyBumps[name] ?? {})
    const filteredDepNames = qDepNames.filter((n) => !aDepNames.includes(n))

    if (filteredDepNames.length > 0) {
      result.dependencyBumpIgnoreMap.set(name, filteredDepNames)
    }
  }

  return result
}

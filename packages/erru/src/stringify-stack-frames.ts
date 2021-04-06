import { isString } from 'tsfn'
import type { TStackFrame } from './types'

export const stringifyStackFrames = (stackFrames: TStackFrame[]): string => {
  let result = ''

  for (const stackFrame of stackFrames) {
    if (isString(stackFrame.fnName)) {
      result += `${stackFrame.fnName} `
    }

    result += stackFrame.location

    if (isString(stackFrame.line)) {
      result += `:${stackFrame.line}`
    }

    if (isString(stackFrame.column)) {
      result += `:${stackFrame.column}`
    }

    result += '\n'
  }

  return result
}

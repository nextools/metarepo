import { pipe } from 'funcom'
import { cleanupStackFrames } from './cleanup-stack-frames'
import { parseStack } from './parse-stack'
import { stringifyStackFrames } from './stringify-stack-frames'

export const cleanupStack = (stack: string): string => {
  return pipe(
    parseStack,
    cleanupStackFrames,
    stringifyStackFrames
  )(stack)
}

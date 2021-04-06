import Module from 'module'
import path from 'path'
import { fileURLToPath } from 'url'
import type { TStackFrame } from './types'

export const cleanupStackFrames = (stackFrames: TStackFrame[]): TStackFrame[] => {
  const result: TStackFrame[] = []
  const cwd = process.cwd()

  for (const stackFrame of stackFrames) {
    if (stackFrame.location.startsWith('internal/')) {
      continue
    }

    let newStackFrame = stackFrame

    if (stackFrame.location.startsWith('file:')) {
      newStackFrame = {
        ...newStackFrame,
        location: path.relative(cwd, fileURLToPath(stackFrame.location)),
      }
    } else if (stackFrame.location.startsWith('/')) {
      newStackFrame = {
        ...newStackFrame,
        location: path.relative(cwd, stackFrame.location),
      }
    } else if (Module.builtinModules.includes(`${stackFrame.location}.js`)) {
      continue
    }

    result.push(newStackFrame)
  }

  return result
}

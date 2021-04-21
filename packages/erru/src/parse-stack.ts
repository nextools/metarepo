import type { TStackFrame } from './types'

const matchers = [
  // Object.[Symbol.asyncIterator] (file:///Users/foo/bar.ts:7:11) -> /Users/foo/bar.ts:16:11
  /^(?<fnName>.+?)\s\(.+?\)\s+->\s(?<location>.+?):(?<line>\d+):(?<column>\d+)$/,
  // async Object.eval [as value] (eval at <anonymous> (file:///Users/foo/bar.ts:56:14), <anonymous>:5:112)
  /^(?<fnName>.+?)\s\(.+\((?<location>.+?):(?<line>\d+):(?<column>\d+)\),.+$/,
  // Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
  /^(?<fnName>.+?)\s\((?<location>.+?):(?<line>\d+):(?<column>\d+)\)$/,
  // file:///Users/foo/bar.ts:17:10 -> /Users/foo/bar.ts:12:10
  /^[^(]+\s+->\s(?<location>.+?):(?<line>\d+):(?<column>\d+)$/,
  // AsyncGenerator.next (<anonymous>)
  /^(?<fnName>.+?)\s\((?<location>[^:]+)\)$/,
  // internal/main/run_main_module.js:17:47
  /^(?<location>[^\s]+):(?<line>\d+):(?<column>\d+)$/,
]

const parseLine = (line: string): null | TStackFrame => {
  for (const matcher of matchers) {
    const matched = line.match(matcher)

    if (matched !== null) {
      return matched.groups as any as TStackFrame
    }
  }

  return null
}

export const parseStack = (stack: string): TStackFrame[] => {
  const lines = stack
    // remove error message
    .replace(/^.+?\s+at\s/sm, '')
    // normalize multiline source-mapped frames
    .replace(/\n\s+->/g, ' ->')
    // get rid of the rest "at" prefix
    .replace(/\n\s+at\s/g, '\n')
    .split('\n')
  const result: TStackFrame[] = []

  for (const line of lines) {
    const parsed = parseLine(line)

    if (parsed !== null) {
      result.push(parsed)
    }
  }

  return result
}

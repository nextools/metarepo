import path from 'path'
import { mockRequire } from '@mock/require'
import { toArrayAsync } from 'iterama'
import { access, readdir } from 'pifs'
import { createSpy, getSpyCalls } from 'spyfn'

const fixturesPath = path.dirname(require.resolve('./fixtures'))

export const joinPath = (str: string): string => path.join(fixturesPath, str)

export const matchGlobs = async (globs: string[]) => {
  const accessSpy = createSpy(({ args }) => access(args[0], args[1]))
  const readdirSpy = createSpy(({ args }) => readdir(args[0], args[1]))
  const unmockRequire = mockRequire('../src', {
    process: {
      cwd: () => fixturesPath,
    },
    pifs: {
      access: accessSpy,
      readdir: readdirSpy,
    },
  })
  const { matchGlobs } = await import('../src')
  const result = await toArrayAsync(matchGlobs(globs))

  unmockRequire()

  return {
    result,
    accessCalls: getSpyCalls(accessSpy).map((call) => call[0]),
    readdirCalls: getSpyCalls(readdirSpy).map((call) => call[0]),
  }
}

import type { TMaybeInputPlugin } from './types'

export const findGitStaged = (): TMaybeInputPlugin<any, string> => async function* (it) {
  const { isAsyncIterable } = await import('tsfn')
  const { drainAsync, mapAsync } = await import('iterama')
  const { spawnChildProcessStream } = await import('spown')
  const { lineStream } = await import('stroki')

  if (isAsyncIterable(it)) {
    await drainAsync(it)
  }

  const childProcess = spawnChildProcessStream('git diff --cached --name-only --diff-filter=ACM')
  const lines = childProcess.stdout!.pipe(lineStream())

  yield* mapAsync((line: Buffer) => {
    return line.toString('utf8').trim()
  })(lines)
}

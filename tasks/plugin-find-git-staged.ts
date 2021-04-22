import type { TMaybeInputPlugin } from '@start/types'

export const findGitStaged = (): TMaybeInputPlugin<any, string> => async function* (it) {
  const { isAsyncIterable } = await import('tsfn')
  const { drainAsync } = await import('iterama')
  const { spawnChildProcessStream } = await import('spown')
  const { lineStream } = await import('stroki')

  if (isAsyncIterable(it)) {
    await drainAsync(it)
  }

  const childProcess = spawnChildProcessStream('git diff --cached --name-only --diff-filter=ACM')
  const lines = childProcess.stdout!.pipe(lineStream())

  for await (const line of lines) {
    yield line.toString('utf8').trim()
  }
}

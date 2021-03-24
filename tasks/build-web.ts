import type { TFile, TTask } from './types'

export const buildWeb = (dir: string): TTask<string, TFile> => async function *(it) {
  const { pipe } = await import('funcom')
  const { read } = await import('./read')
  const { rename } = await import('./rename')
  const { babel } = await import('./babel')
  const { babelConfigBuildWeb } = await import('./babel-config')
  const { write } = await import('./write')

  yield* pipe(
    read,
    babel(babelConfigBuildWeb),
    rename((path) => path.replace(/\.tsx?$/, '.js')),
    write(`${dir}/web/`)
  )(it)
}

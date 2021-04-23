import type { TFile, TPlugin, TTask } from '@start/types'

const buildIt = (outDir: string): TPlugin<string, TFile> => async function* (it) {
  const { pipe } = await import('funcom')
  const { read } = await import('./plugin-read')
  const { babel } = await import('./plugin-lib-babel')
  const { babelConfigBuildReactNative } = await import('@nextools/babel-config')
  const { rename } = await import('./plugin-rename')
  const { replaceExt } = await import('ekst')
  const { write } = await import('./plugin-write')

  yield* pipe(
    read,
    babel(babelConfigBuildReactNative),
    rename(replaceExt('.ts', '.js')),
    write(outDir)
  )(it)
}

export const buildReactNative: TTask<string, TFile> = async function* (pkg) {
  const { pipe } = await import('funcom')
  const { forEachAsync, filterAsync, finallyAsync } = await import('iterama')
  const { find } = await import('./plugin-find')
  const { remove } = await import('./plugin-remove')
  const { log } = await import('./plugin-log')
  const { mapThreadPool } = await import('@start/thread-pool')

  const outDir = `packages/${pkg}/build/react-native/`
  const extensions = '{js,jsx,ts,tsx,mjs,cjs}'
  const extRegExp = /\.(js|jsx|ts|tsx|mjs|cjs)$/
  const files = new Set<string>()

  yield* pipe(
    find(outDir),
    remove,
    find([
      `packages/${pkg}/src/**/*.${extensions}`,
      `!packages/${pkg}/src/**/*.d.ts`,
    ]),
    forEachAsync((path) => {
      files.add(path)
    }),
    filterAsync((path) => {
      // skip foo.ts if there was foo.native.ts | foo.ios.ts | foo.android.ts already
      if (
        files.has(path.replace(extRegExp, '.native.$1')) ||
        files.has(path.replace(extRegExp, '.ios.$1')) ||
        files.has(path.replace(extRegExp, '.android.$1'))
      ) {
        return false
      }

      return true
    }),
    // buildIt(outDir),
    mapThreadPool(buildIt, [outDir], { groupBy: 4 }),
    log('react-native'),
    finallyAsync(() => {
      files.clear()
    })
  )()
}

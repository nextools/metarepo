import type { TTask } from '@start/types'

export const buildApp: TTask<string, string> = async function* (pkg) {
  const { pipe } = await import('funcom')
  const { drainAsync } = await import('iterama')
  const { find } = await import('./plugin-find')
  const { remove } = await import('./plugin-remove')
  const { log } = await import('./plugin-log')
  const { isString } = await import('tsfn')
  const { buildWebAppRelease } = await import('@rebox/web')
  const { browsersList } = await import('@nextools/browsers-list')

  if (!isString(pkg)) {
    throw new Error('`pkg` argument is required')
  }

  const outputPath = 'build/refps/'

  yield* pipe(
    find(outputPath),
    remove,
    async function* (it) {
      await drainAsync(it)

      yield* await buildWebAppRelease({
        entryPointPath: 'tasks/refps/index.tsx',
        htmlTemplatePath: 'tasks/refps/index.html',
        outputPath,
        browsersList,
        shouldGenerateBundleAnalyzerReport: true,
        shouldGenerateSourceMaps: true,
      })
    },
    log('emitted')
  )()
}

export const runApp: TTask<string, any> = async function* (pkg) {
  const { isString } = await import('tsfn')
  const { runWebApp } = await import('@rebox/web')

  if (!isString(pkg)) {
    throw new Error('`pkg` argument is required')
  }

  await runWebApp({
    entryPointPath: 'tasks/refps/index.tsx',
    htmlTemplatePath: 'tasks/refps/index.html',
    isQuiet: true,
  })
}

// export const stopApp: TTask<string, any> = async function* (pkg) {

// }

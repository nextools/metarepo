import plugin from '@start/plugin'

export type TAssets = {
  [key: string]: string,
}

const globbyOptions = {
  ignore: ['node_modules/**'],
  deep: Infinity,
  onlyFiles: true,
  absolute: true,
}

export default (packageDir: string, assets: TAssets) =>
  plugin('copy', ({ logPath }) => async () => {
    const path = await import('path')
    const { default: movePath } = await import('move-path')
    const { default: makeDir } = await import('make-dir')
    const { default: globby } = await import('globby')
    const { default: copie } = await import('copie')

    for (const [assetsGlob, assetsDir] of Object.entries(assets)) {
      const buildDir = path.join(packageDir, 'build/', assetsDir)
      const files = await globby(`${packageDir}/${assetsGlob}`, globbyOptions)

      for (const file of files) {
        const outFile = movePath(file, buildDir)
        const outDir = path.dirname(outFile)

        await makeDir(outDir)
        await copie(file, outFile)

        logPath(outFile)
      }
    }
  })

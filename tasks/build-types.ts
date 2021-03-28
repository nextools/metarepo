import type { TPlugin, TTask } from './types'

const buildIt = (outDir: string): TPlugin<string, string> => async function* (it: AsyncIterable<string>) {
  const path = await import('path')
  const { default: ts } = await import('typescript')
  const { mapAsync } = await import('iterama')

  yield* mapAsync((filePath: string) => {
    const inDir = path.dirname(filePath)
    const outDirFull = path.resolve(outDir)

    const configPath = ts.findConfigFile(inDir, ts.sys.fileExists)

    if (typeof configPath === 'undefined') {
      throw new Error(`Unable to find \`tsconfig.json\` for ${inDir}`)
    }

    const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
    const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath))
    const options = {
      ...parsedConfig.options,
      noEmitOnError: true,
      noEmit: false,
      emitDeclarationOnly: true,
      declarationDir: outDirFull,
      declaration: true,
      allowJs: false,
    }

    // ignore non-TS files if there is no `allowJs` option
    if (!(filePath.endsWith('.ts') || filePath.endsWith('.tsx')) && !options.allowJs) {
      return filePath
    }

    const program = ts.createProgram([filePath], options)
    const emitResult = program.emit()

    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

    const message = ts.formatDiagnosticsWithColorAndContext(allDiagnostics, {
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getCanonicalFileName: (fileName) => fileName,
      getNewLine: () => ts.sys.newLine,
    })

    if (message.length > 0) {
      console.log(message)
    }

    return filePath
  })(it)
}

export const buildTypes: TTask<string, string> = async function* (pkg) {
  const { pipe } = await import('funcom')
  const { find } = await import('./find')
  const { remove } = await import('./remove')
  const { mapThreadPool } = await import('@start/thread-pool')

  const outDir = `packages/${pkg}/build/types/`

  yield* pipe(
    find(outDir),
    remove,
    find(`packages/${pkg}/src/index.ts`),
    // buildIt(outDir),
    mapThreadPool(buildIt, outDir)
  )()
}

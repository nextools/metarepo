import type { TPlugin } from './types'

export const typescriptGenerate = (outDir: string): TPlugin<string, string> => async function* (it) {
  const { dirname } = await import('path')
  const { default: ts } = await import('typescript')
  const { pipe } = await import('funcom')
  const { mapAsync, ungroupAsync } = await import('iterama')

  yield* pipe(
    mapAsync((filePath: string) => {
      const inDir = dirname(filePath)
      const configPath = ts.findConfigFile(inDir, ts.sys.fileExists)

      if (typeof configPath === 'undefined') {
        throw new Error(`Unable to find \`tsconfig.json\` for ${inDir}`)
      }

      const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
      const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, dirname(configPath))
      const options = {
        ...parsedConfig.options,
        noEmitOnError: true,
        noEmit: false,
        emitDeclarationOnly: true,
        declarationDir: outDir,
        declaration: true,
        allowJs: false,
      }

      const program = ts.createProgram([filePath], options)
      const emittedFiles = new Set<string>()
      const emitResult = program.emit(undefined, (fileName, data, writeByteOrderMark) => {
        emittedFiles.add(fileName)

        return ts.sys.writeFile(fileName, data, writeByteOrderMark)
      })
      const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
      const message = ts.formatDiagnosticsWithColorAndContext(allDiagnostics, {
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getCanonicalFileName: (fileName) => fileName,
        getNewLine: () => ts.sys.newLine,
      })

      if (message.length > 0) {
        console.log(message)
      }

      return emittedFiles
    }),
    ungroupAsync
  )(it)
}

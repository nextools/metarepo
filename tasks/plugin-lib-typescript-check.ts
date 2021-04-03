import type { TNoInputPlugin } from './types'

export const typescriptCheck: TNoInputPlugin<string> = async function* () {
  const path = await import('path')
  const { isUndefined } = await import('tsfn')
  const { default: ts } = await import('typescript')

  const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists)

  if (isUndefined(configPath)) {
    throw new Error('Unable to find `tsconfig.json`')
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
  const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath))
  const options = {
    ...parsedConfig.options,
    project: '.',
    noEmit: false,
    noEmitOnError: true,
    emitDeclarationOnly: false,
    declaration: false,
  }

  const program = ts.createProgram(parsedConfig.fileNames, options)
  const emitResult = program.emit()

  const diagnostics = ts.sortAndDeduplicateDiagnostics(
    ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
  )

  const message = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getCanonicalFileName: (fileName) => fileName,
    getNewLine: () => ts.sys.newLine,
  })

  yield* program.getRootFileNames()

  if (message.length > 0) {
    console.log(message)

    throw null
  }
}

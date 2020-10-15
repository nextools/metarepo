import plugin from '@start/plugin'

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
export default (inDir: string, outDir: string) =>
  plugin('typescriptGenerate', ({ logPath }) => async () => {
    const path = await import('path')
    const ts = await import('typescript')

    const inDirFull = path.resolve(inDir)
    const outDirFull = path.resolve(outDir)
    const inFile = require.resolve(inDirFull)

    const configPath = ts.findConfigFile(inDirFull, ts.sys.fileExists)

    if (typeof configPath === 'undefined') {
      throw new Error(`Unable to find \`tsconfig.json\` for ${inDir}`)
    }

    const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
    const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath))
    const options = {
      ...parsedConfig.options,
      noEmit: false,
      emitDeclarationOnly: true,
      declarationDir: outDirFull,
      declaration: true,
      allowJs: false,
    }

    // ignore non-TS files if there is no `allowJs` option
    if (!(inFile.endsWith('.ts') || inFile.endsWith('.tsx')) && !options.allowJs) {
      return
    }

    const program = ts.createProgram([inFile], options)
    const emitResult = program.emit()

    logPath(inFile)

    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

    for (const diagnostic of allDiagnostics) {
      if (typeof diagnostic.file === 'undefined') {
        console.log(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`)

        continue
      }

      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!)
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')

      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
    }
  })

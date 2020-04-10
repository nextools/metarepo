import { CompilerOptions } from 'typescript'
import plugin, { StartFilesProps } from '@start/plugin'

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
export default (outDirRelative: string) =>
  plugin('typescriptGenerate', ({ logPath }) => async ({ files }: StartFilesProps) => {
    const path = await import('path')
    const ts = await import('typescript')

    const filePaths = files.map((file) => file.path)

    for (const filePath of filePaths) {
      logPath(filePath)

      const fileDir = path.dirname(filePath)
      const configPath = ts.findConfigFile(fileDir, ts.sys.fileExists)

      if (typeof configPath === 'undefined') {
        throw new Error(`Unable to find \`tsconfig.json\` for ${fileDir}`)
      }

      const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
      const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, fileDir)
      const options: CompilerOptions = {
        ...parsedConfig.options,
        noEmit: false,
        emitDeclarationOnly: true,
        declarationDir: path.resolve(outDirRelative),
        declaration: true,
      }

      const program = ts.createProgram(filePaths, options)
      const emitResult = program.emit()
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
    }

    return { files }
  })

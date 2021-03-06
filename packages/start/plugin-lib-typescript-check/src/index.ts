// import plugin from '@start/plugin'

// export type Options = {
//   [key: string]: boolean | string | string[],
// }

// export default (userOptions?: Options) =>
//   plugin('typescriptCheck', () => async () => {
//     const { spawnChildProcess } = await import('spown')

//     const options: Options = {
//       ...userOptions,
//       project: '.',
//       noEmit: true,
//     }
//     let cmd = 'tsc'

//     for (const [key, value] of Object.entries(options)) {
//       if (typeof value === 'boolean') {
//         cmd += ` --${key}`
//       } else if (typeof value === 'string') {
//         cmd += ` --${key} ${value}`
//       } else if (Array.isArray(value)) {
//         cmd += ` --${key} ${value.join(',')}`
//       }
//     }

//     try {
//       await spawnChildProcess(cmd, {
//         stdout: process.stdout,
//         stderr: process.stderr,
//       })
//     } catch {
//       throw null
//     }
//   })

import plugin from '@start/plugin'

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
export default () =>
  plugin('typescriptGenerate', ({ logPath }) => async () => {
    const path = await import('path')
    const ts = await import('typescript')

    const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists)

    if (typeof configPath === 'undefined') {
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

    // logPath(inFile)

    const diagnostics = ts.sortAndDeduplicateDiagnostics(
      ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
    )

    const message = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getCanonicalFileName: (fileName) => fileName,
      getNewLine: () => ts.sys.newLine,
    })

    console.log(message)
    // for (const diagnostic of allDiagnostics) {
    //   if (typeof diagnostic.file === 'undefined') {
    //     const a = ts.formatDiagnosticsWithColorAndContext(diagnostic)

    //     console.log(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`)

    //     continue
    //   }

    //   const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!)
    //   const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')

    //   console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
    // }
  })

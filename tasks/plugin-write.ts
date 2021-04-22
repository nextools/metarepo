import type { TFile, TPlugin } from '@start/types'

export const write = (outDir: string): TPlugin<TFile, TFile> => async function* (it) {
  const { join, basename, dirname, extname } = await import('path')
  const { writeFile } = await import('fs/promises')
  const { default: movePath } = await import('move-path')
  const { makeDir } = await import('dirdir')
  const { isObject } = await import('tsfn')

  for await (const file of it) {
    const outFile = movePath(file.path, outDir)
    const outFileDir = dirname(outFile)

    await makeDir(outFileDir)

    const filesToWrite = []
    let fileData = file.data

    if (isObject(file.map)) {
      const inFile = basename(file.path)
      // /beep/boop/src/beep/index.js -> .js
      const inExtname = extname(file.path)
      // index.js -> index.js.map
      const sourcemapFile = `${inFile}.map`
      // /beep/boop/build/beep/index.js -> /beep/boop/build/beep/index.js.map
      const sourcemapPath = join(outFileDir, sourcemapFile)
      const sourcemapData = JSON.stringify(file.map)

      // /*# sourceMappingURL=index.css.map */
      if (inExtname === '.css') {
        fileData += '\n/*# sourceMappingURL='
        fileData += sourcemapFile
        fileData += ' */'
        // //# sourceMappingURL=index.js.map
      } else {
        fileData += '\n//# sourceMappingURL='
        fileData += sourcemapFile
      }

      filesToWrite.push(
        writeFile(sourcemapPath, sourcemapData, 'utf8')
      )
    }

    filesToWrite.push(
      writeFile(outFile, fileData, 'utf8')
    )

    await Promise.all(filesToWrite)

    yield file
  }
}

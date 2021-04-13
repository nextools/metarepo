import type { TFile, TPlugin } from './types'

export const write = (outDir: string): TPlugin<TFile, TFile> => async function* (iterable) {
  const path = await import('path')
  const { writeFile } = await import('fs/promises')
  const { mapAsync } = await import('iterama')
  const { default: movePath } = await import('move-path')
  const { makeDir } = await import('dirdir')
  const { isObject } = await import('tsfn')

  yield* mapAsync(async (file: TFile) => {
    const outDirFull = path.resolve(outDir)
    const outFile = movePath(file.path, outDirFull)
    const outFileDir = path.dirname(outFile)

    await makeDir(outFileDir)

    const filesToWrite = []
    let fileData = file.data

    if (isObject(file.map)) {
      const inFile = path.basename(file.path)
      // /beep/boop/src/beep/index.js -> .js
      const inExtname = path.extname(file.path)
      // index.js -> index.js.map
      const sourcemapFile = `${inFile}.map`
      // /beep/boop/build/beep/index.js -> /beep/boop/build/beep/index.js.map
      const sourcemapPath = path.join(outFileDir, sourcemapFile)
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

    return file
  })(iterable)
}

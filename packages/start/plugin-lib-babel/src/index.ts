import type { TransformOptions } from '@babel/core'
import plugin from '@start/plugin'
import type { StartDataFile, StartDataFilesProps } from '@start/plugin'

export default (userOptions?: TransformOptions) =>
  plugin('babel', ({ logPath }) => async ({ files }: StartDataFilesProps) => {
    const { transform } = await import('@babel/core')
    const { isObject, isString } = await import('tsfn')

    return {
      files: await Promise.all(
        files.reduce((result, file): StartDataFile[] => {
          const options: TransformOptions = {
            ...userOptions,
            ast: false,
            inputSourceMap: file.map != null ? file.map : false,
            filename: file.path,
          }
          const transformed = transform(file.data, options)

          if (transformed !== null) {
            if (typeof transformed.code !== 'string' || transformed.code === '') {
              return result
            }

            const dataFile: StartDataFile = {
              path: file.path,
              data: transformed.code,
            }

            if ((options.sourceMaps === true || isString(options.sourceMaps)) && isObject(transformed.map)) {
              dataFile.map = transformed.map
            }

            logPath(file.path)

            result.push(dataFile)
          }

          return result
        }, [] as StartDataFile[])
      ),
    }
  })

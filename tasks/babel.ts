import type { TransformOptions } from '@babel/core'
import type { TFile } from './types'

export const babel = (userOptions?: TransformOptions) => async (iterable: AsyncIterable<TFile>): Promise<AsyncIterable<TFile>> => {
  const { transformAsync } = await import('@babel/core')
  const { isObject, isString, isNull } = await import('tsfn')
  const { mapAsync } = await import('iterama')

  return mapAsync(async (file: TFile) => {
    const options: TransformOptions = {
      ...userOptions,
      ast: false,
      // @ts-ignore
      inputSourceMap: isObject(file.map) ? file.map : false,
      filename: file.path,
    }

    const transformed = await transformAsync(file.data, options)

    if (!isNull(transformed) && isString(transformed.code) && transformed.code !== '') {
      if ((options.sourceMaps === true || isString(options.sourceMaps)) && isObject(transformed.map)) {
        return {
          path: file.path,
          data: transformed.code,
          map: transformed.map,
        }
      }

      return {
        path: file.path,
        data: transformed.code,
      }
    }

    return file
  })(iterable)
}

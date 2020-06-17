import { reduce, toArray, map } from 'iterama'
import { pipe } from 'funcom'
import { TListItems, TTotalResults, TResultsType, TEncoding, TFileResults } from '../types'

export type TGetListOptions = {
  results: TTotalResults<TResultsType>,
  encoding: TEncoding,
}

export type TListResponse = {
  type: TEncoding,
  files: string[],
  items: TListItems,
}

export const getList = (options: TGetListOptions): TListResponse => {
  const shortKeys = pipe(
    map((value: TFileResults<TResultsType>) => value.name),
    toArray
  )(options.results.values())

  const items = reduce((acc, fileResults: TFileResults<TResultsType>) => {
    for (const [exampleId, exampleResult] of fileResults.results) {
      const key = `${fileResults.name}::${exampleId}`

      switch (exampleResult.type) {
        case 'NEW': {
          acc[key] = {
            type: 'NEW',
            width: exampleResult.width,
            height: exampleResult.height,
          }

          break
        }
        case 'DIFF': {
          acc[key] = {
            type: 'DIFF',
            width: exampleResult.width,
            height: exampleResult.height,
            origWidth: exampleResult.origWidth,
            origHeight: exampleResult.origHeight,
          }

          break
        }
        case 'DELETED': {
          acc[key] = {
            type: 'DELETED',
            width: exampleResult.width,
            height: exampleResult.height,
          }

          break
        }
      }
    }

    return acc
  },
  {} as TListItems)(options.results.values())

  return {
    type: options.encoding,
    files: shortKeys,
    items,
  }
}

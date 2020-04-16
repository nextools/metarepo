import { reduce, toArray, map } from 'iterama'
import { pipe } from 'funcom'
import { TListItems, TTotalResults } from '../types'
import { TResultsType } from './types'

// type TIterableType<T> = T extends Iterable<infer R> ? R : never
// type TMapKey<T> = T extends Map<infer R, any> ? R : never
type TMapValue<T> = T extends Map<any, infer R> ? R : never

export type TGetListOptions = {
  results: TTotalResults<TResultsType>,
  encoding: 'image' | 'text',
}

export type TListResponse = {
  type: 'image' | 'text',
  files: string[],
  items: TListItems,
}

export const getList = (options: TGetListOptions): TListResponse => {
  const shortKeys = pipe(
    map((value: TMapValue<TTotalResults<TResultsType>>) => value.name),
    toArray
  )(options.results.values())

  const items = reduce((acc, fileResults: TMapValue<TTotalResults<TResultsType>>) => {
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

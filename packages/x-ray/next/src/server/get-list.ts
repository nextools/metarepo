import { reduce, toArray, map } from 'iterama'
import { pipe } from 'funcom'
import { TListItems, TTotalResults } from '../types'

// type TIterableType<T> = T extends Iterable<infer R> ? R : never
// type TMapKey<T> = T extends Map<infer R, any> ? R : never
type TMapValue<T> = T extends Map<any, infer R> ? R : never

export type TListResponse = {
  type: 'image',
  files: string[],
  items: TListItems,
}

export const getList = (totalResults: TTotalResults): TListResponse => {
  const shortKeys = pipe(
    map((value: TMapValue<TTotalResults>) => value.name),
    toArray
  )(totalResults.values())

  const items = reduce((acc, fileResults: TMapValue<TTotalResults>) => {
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
            newWidth: exampleResult.newWidth,
            newHeight: exampleResult.newHeight,
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
  {} as TListItems)(totalResults.values())

  return {
    type: 'image',
    files: shortKeys,
    items,
  }
}

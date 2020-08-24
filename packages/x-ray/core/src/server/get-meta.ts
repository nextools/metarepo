import type { TJsonValue } from 'typeon'
import type { TGetResponseQuery, TTotalResults, TResultsType } from '../types'

export type TGetMetaOptions = {
  results: TTotalResults<TResultsType>,
  pathsMap: Map<string, string>,
  query: TGetResponseQuery,
}

export const getMeta = (options: TGetMetaOptions): TJsonValue => {
  const [name, id] = options.query.id.split('::')

  const result = options.results.get(options.pathsMap.get(name)!)!.results.get(id)!

  if (result.type === 'OK') {
    return null
  }

  if (Reflect.has(result, 'meta')) {
    return result.meta!
  }

  return null
}

import type { TGetResponseQuery, TTotalResults, TResultsType } from '../types'

export type TGetResultOptions = {
  results: TTotalResults<TResultsType>,
  pathsMap: Map<string, string>,
  query: TGetResponseQuery,
}

export const getResult = (options: TGetResultOptions): TResultsType | null => {
  const [name, id] = options.query.id.split('::')

  const result = options.results.get(options.pathsMap.get(name)!)!.results.get(id)!

  if (result.type === 'NEW') {
    return result.data
  }

  if (result.type === 'DELETED') {
    return result.data
  }

  if (result.type === 'DIFF' && options.query.type === 'ORIG') {
    return result.origData
  }

  if (result.type === 'DIFF' && options.query.type === 'NEW') {
    return result.data
  }

  return null
}

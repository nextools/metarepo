import { TGetResponseQuery, TTotalResults } from '../types'

export const getBuffer = (totalResults: TTotalResults, pathsMap: Map<string, string>, query: TGetResponseQuery): Buffer | null => {
  const [name, id] = query.id.split('::')

  const result = totalResults.get(pathsMap.get(name)!)!.results.get(id)!

  if (result.type === 'NEW') {
    return Buffer.from(result.data)
  }

  if (result.type === 'DELETED') {
    return Buffer.from(result.data)
  }

  if (result.type === 'DIFF' && query.type === 'ORIG') {
    return Buffer.from(result.origData)
  }

  if (result.type === 'DIFF' && query.type === 'NEW') {
    return Buffer.from(result.newData)
  }

  return null
}

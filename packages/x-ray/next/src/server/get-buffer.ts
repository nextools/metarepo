import { TGetResponseQuery, TTotalResults } from '../types'

export type TGetBufferOptions = {
  totalResults: TTotalResults,
  pathsMap: Map<string, string>,
  query: TGetResponseQuery,
}

export const getBuffer = (options: TGetBufferOptions): Buffer | null => {
  const [name, id] = options.query.id.split('::')

  const result = options.totalResults.get(options.pathsMap.get(name)!)!.results.get(id)!

  if (result.type === 'NEW') {
    return Buffer.from(result.data)
  }

  if (result.type === 'DELETED') {
    return Buffer.from(result.data)
  }

  if (result.type === 'DIFF' && options.query.type === 'ORIG') {
    return Buffer.from(result.origData)
  }

  if (result.type === 'DIFF' && options.query.type === 'NEW') {
    return Buffer.from(result.newData)
  }

  return null
}

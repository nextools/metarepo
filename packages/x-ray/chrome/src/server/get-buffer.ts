import { TResults, TGetResponseQuery } from '../types'

export const getBuffer = (results: TResults, pathMap: Map<string, string>, query: TGetResponseQuery): Buffer | null => {
  const [shortPath, id] = query.id.split(':')
  const longPath = pathMap.get(shortPath)!
  const result = results.get(longPath)!.get(id)!

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

import { HOST, PORT } from '../config'

export type TFileResultLine = {
  value: string,
  type?: 'added' | 'removed',
}

const apiLoadSnapshotCache = new Map<string, TFileResultLine[]>()

export type TApiLoadSnapshotOpts = {
  id: string,
  type: 'ORIG' | 'NEW',
}

export const apiLoadSnapshot = async (opts: TApiLoadSnapshotOpts): Promise<TFileResultLine[]> => {
  const params = `type=${opts.type}&id=${encodeURIComponent(opts.id)}`

  if (apiLoadSnapshotCache.has(params)) {
    return apiLoadSnapshotCache.get(params)!
  }

  const response = await fetch(`http://${HOST}:${PORT}/get?${params}`)

  if (!response.ok) {
    throw new Error(`Load snapshot (${response.status}): ${response.statusText}`)
  }

  const resultStr = await response.text()
  const result = JSON.parse(resultStr)

  apiLoadSnapshotCache.set(params, result)

  return result
}

import { HOST, PORT } from '../config'

const apiLoadSnapshotCache = new Map<string, string>()

export type TApiLoadSnapshotOpts = {
  id: string,
  type: 'ORIG' | 'NEW',
}

export const apiLoadSnapshot = async (opts: TApiLoadSnapshotOpts): Promise<string> => {
  const params = `type=${opts.type}&id=${encodeURIComponent(opts.id)}`

  if (apiLoadSnapshotCache.has(params)) {
    return apiLoadSnapshotCache.get(params)!
  }

  const response = await fetch(`http://${HOST}:${PORT}/get-result?${params}`)

  if (!response.ok) {
    throw new Error(`Load snapshot (${response.status}): ${response.statusText}`)
  }

  const result = await response.text()

  apiLoadSnapshotCache.set(params, result)

  return result
}

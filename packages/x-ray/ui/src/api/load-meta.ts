import type { TJsonValue } from 'typeon'
import { HOST, PORT } from '../config'

const apiLoadMetaCache = new Map<string, TJsonValue>()

export type TApiLoadMetaOpts = {
  id: string,
}

export const apiLoadMeta = async (opts: TApiLoadMetaOpts): Promise<TJsonValue> => {
  const params = `id=${encodeURIComponent(opts.id)}`

  if (apiLoadMetaCache.has(params)) {
    return apiLoadMetaCache.get(params)!
  }

  const response = await fetch(`http://${HOST}:${PORT}/get-meta?${params}`)

  if (!response.ok) {
    throw new Error(`Load meta (${response.status}): ${response.statusText}`)
  }

  const json = await response.json()

  apiLoadMetaCache.set(params, json)

  return json
}

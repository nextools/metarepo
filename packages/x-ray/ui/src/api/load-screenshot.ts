import { TScreenshotResultType } from '@x-ray/screenshot-utils'
import { HOST, PORT } from '../config'

const apiLoadScreenshotCache = new Map<string, Blob>()

export type TApiLoadScreenshotOpts = {
  id: string,
  type: TScreenshotResultType,
}

export const apiLoadScreenshot = async (opts: TApiLoadScreenshotOpts): Promise<Blob> => {
  const params = `type=${opts.type}&id=${encodeURIComponent(opts.id)}`

  if (apiLoadScreenshotCache.has(params)) {
    return apiLoadScreenshotCache.get(params)!
  }

  const response = await fetch(`http://${HOST}:${PORT}/get?${params}`)

  if (!response.ok) {
    throw new Error(`Load screenshot (${response.status}): ${response.statusText}`)
  }

  const blob = await response.blob()

  apiLoadScreenshotCache.set(params, blob)

  return blob
}

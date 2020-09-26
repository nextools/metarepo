import type { Stream } from 'stream'
import { unchunkString } from 'unchunk'

export const streamToString = async (stream: Stream): Promise<string> => {
  const result = await unchunkString(stream)

  return result.trimRight()
}

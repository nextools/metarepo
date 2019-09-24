import { TAnyObject } from 'tsfn'

export const encodeUrl = (obj: TAnyObject): string =>
  encodeURIComponent(JSON.stringify(obj))

export const decodeUrl = (hash: string): TAnyObject | null => {
  try {
    return JSON.parse(decodeURIComponent(hash))
  } catch (e) {
    return null
  }
}

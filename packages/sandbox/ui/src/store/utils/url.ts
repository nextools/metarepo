import { TAnyObject, isNumber } from 'tsfn'
import queryString from 'query-string'

export const encodeUrl = (obj: TAnyObject): string => queryString.stringify(obj)

export const decodeUrl = (hash: string): TAnyObject => {
  const res = queryString.parse(hash, {
    parseBooleans: true,
    parseNumbers: true,
  })

  if (isNumber(res.selectedSetIndex)) {
    res.selectedSetIndex = String(res.selectedSetIndex)
  }

  return res
}

import { HOST, PORT } from '../config'
import { TListItems } from '../../../next/src/types'

export type TApiLoadListResult = {
  type: 'image' | 'text',
  files: string[],
  items: TListItems,
}

export const apiLoadList = async (): Promise<TApiLoadListResult> => {
  const response = await fetch(`http://${HOST}:${PORT}/list`)

  if (!response.ok) {
    throw new Error(`Load list (${response.status}): ${response.statusText}`)
  }

  return response.json()
}

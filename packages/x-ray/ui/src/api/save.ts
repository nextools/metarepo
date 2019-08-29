import { HOST, PORT } from '../config'

export const apiSave = async (items: string[]): Promise<void> => {
  const response = await fetch(`http://${HOST}:${PORT}/save`, {
    method: 'POST',
    body: JSON.stringify(items),
  })

  if (!response.ok) {
    throw new Error(`Save (${response.status}): ${response.statusText}`)
  }
}

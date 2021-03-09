import { fileURLToPath } from 'url'

export const resolve = async (specifier: string) => {
  const url = await import.meta.resolve(specifier)

  return fileURLToPath(url)
}

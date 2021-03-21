import { fileURLToPath } from 'url'

export const resolve = async (specifier: string) => {
  // @ts-ignore
  const url = await import.meta.resolve(specifier)

  return fileURLToPath(url)
}

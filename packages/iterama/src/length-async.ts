import { iterateAsync } from './iterate-async'

export const lengthAsync = async <T>(iterable: AsyncIterable<T>): Promise<number> => {
  const asyncGenerator = iterateAsync(iterable)
  let i = 0

  while (i < Number.MAX_SAFE_INTEGER) {
    const result = await asyncGenerator.next()

    if (result.done) {
      break
    }

    i++
  }

  return i
}

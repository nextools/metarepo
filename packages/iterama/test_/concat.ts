export const tests = [
  async () => {
    const { deepStrictEqual } = await import('assert')
    const { concat } = await import('../src/concat')
    const { range } = await import('../src/range')
    const { slice } = await import('../src/slice')
    const { toArray } = await import('../src/to-array')

    const iterable1 = range(5)
    const iterable2 = slice(5)(range(10))
    const result = toArray(concat(iterable1, iterable2))

    deepStrictEqual(
      result,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    )
  },
]

export const target = '../src/concat.ts'
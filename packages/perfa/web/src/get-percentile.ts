export const getPercentile = (arr: number[], p: number): number => {
  const index = (arr.length - 1) * p
  const lower = Math.floor(index)
  const upper = lower + 1
  const weight = index % 1

  if (upper >= arr.length) {
    return arr[lower]
  }

  return arr[lower] * (1 - weight) + arr[upper] * weight
}

export const getNumSkipMutex = (values: bigint[], length: bigint[], changedIndex: number): bigint => {
  let numSkip = 1n

  for (let i = 0; i <= changedIndex; ++i) {
    numSkip *= (length[i] - values[i])
  }

  return numSkip
}

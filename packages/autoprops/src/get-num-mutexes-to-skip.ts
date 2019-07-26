export const getNumMutexesToSkip = (currentPerm: number[], lengthPerm: number[]): number => {
  let leftMostIndex = -1

  for (let i = 0; i < currentPerm.length; ++i) {
    if (currentPerm[i] === 1) {
      leftMostIndex = i

      break
    }
  }

  let skipLength = 1

  for (let i = 0; i <= leftMostIndex; ++i) {
    skipLength *= (lengthPerm[i] - currentPerm[i])
  }

  if (skipLength > 1) {
    return skipLength
  }

  return 0
}

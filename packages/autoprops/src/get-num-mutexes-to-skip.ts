export const getNumMutexesToSkip = (currentPerm: number[], lengthPerm: number[]): number => {
  let secondRightMostIndex = -1

  for (let isSecondRmi = false, rmi = currentPerm.length - 1; rmi >= 0; --rmi) {
    if (currentPerm[rmi] === 1) {
      if (isSecondRmi) {
        secondRightMostIndex = rmi

        break
      }

      isSecondRmi = true
    }
  }

  let skipLength = 1

  for (let p = 0; p <= secondRightMostIndex; ++p) {
    skipLength *= (lengthPerm[p] - currentPerm[p])
  }

  if (skipLength > 1) {
    return skipLength
  }

  return 0
}

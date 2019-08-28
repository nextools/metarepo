export const checkRestrictionMutex = (keysWithState: string[], mutexGroups: string[][]): number => {
  for (let i = 0; i < mutexGroups.length; ++i) {
    const mutexGroup = mutexGroups[i]
    let intersectCount = 0

    for (const mutexKey of mutexGroup) {
      for (const keyWithState of keysWithState) {
        if (mutexKey === keyWithState) {
          ++intersectCount
        }

        if (intersectCount > 1) {
          return i
        }
      }
    }
  }

  return -1
}

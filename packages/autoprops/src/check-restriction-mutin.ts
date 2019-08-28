export const checkRestrictionMutin = (keysWithState: string[], mutinGroups: string[][]): number => {
  for (let i = 0; i < mutinGroups.length; ++i) {
    const mutinGroup = mutinGroups[i]
    let intersectCount = 0

    for (const mutinKey of mutinGroup) {
      for (const keyWithState of keysWithState) {
        if (mutinKey === keyWithState) {
          ++intersectCount
        }
      }
    }

    if (intersectCount > 0 && intersectCount !== mutinGroup.length) {
      return i
    }
  }

  return -1
}

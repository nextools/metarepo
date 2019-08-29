export const getGroupIndices = (propsKeys: string[], group: string[], indexOffset: number): number[] => {
  const result: number[] = []

  for (let i = 0; i < propsKeys.length; ++i) {
    if (group.includes(propsKeys[i])) {
      result.push(i + indexOffset)
    }
  }

  return result
}

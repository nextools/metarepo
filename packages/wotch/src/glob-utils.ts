export const isNegatedGlob = (glob: string): boolean => {
  return glob.charAt(0) === '!' && glob.charAt(1) !== '('
}

export const isMatchingGlob = (glob: string): boolean => !isNegatedGlob(glob)

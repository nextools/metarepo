import picomatch from 'picomatch'

export const isPathIgnored = (path: string, negatedGLobs: Iterable<string>): boolean => {
  for (const negatedGlob of negatedGLobs) {
    if (!picomatch.isMatch(path, negatedGlob)) {
      return true
    }
  }

  return false
}

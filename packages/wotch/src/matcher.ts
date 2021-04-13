import { sep } from 'path'
import picomatch from 'picomatch'

export const fileMatcher = (glob: string, negatedGlobs: Iterable<string>) => (path: string): boolean => {
  if (!picomatch.isMatch(path, glob)) {
    return false
  }

  for (const negatedGlob of negatedGlobs) {
    if (!picomatch.isMatch(path, negatedGlob)) {
      return false
    }
  }

  return true
}

type TToken = {
  value: string,
  depth: number,
  isGlob: boolean,
}

export const dirMatcher = (glob: string, negatedGlobs: Iterable<string>) => {
  const { tokens: globTokens } = picomatch.scan(glob, { tokens: true, parts: true }) as { tokens: TToken[] }

  return (path: string): boolean => {
    const pathTokens = path.split(sep)

    for (let i = 0; i < pathTokens.length; i++) {
      const globToken = globTokens[i]
      const pathToken = pathTokens[i]

      if (globToken.isGlob && globToken.depth === Infinity) {
        break
      }

      if (globToken.isGlob && !picomatch.isMatch(pathToken, globToken.value)) {
        return false
      }

      if (!globToken.isGlob && pathToken !== globToken.value) {
        return false
      }
    }

    for (const negatedGlob of negatedGlobs) {
      if (!picomatch.isMatch(path, negatedGlob)) {
        return false
      }
    }

    return true
  }
}


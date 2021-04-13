import { join } from 'path'
import picomatch from 'picomatch'
import { access, readdir } from 'pifs'
import { isPathIgnored } from './is-path-ignored'

type TToken = {
  value: string,
  depth: number,
  isGlob: boolean,
}

const readDirOptions = {
  withFileTypes: true as const,
  encoding: 'utf8' as const,
}

export const matchGlob = (negatedGlobs: Iterable<string>) => (glob: string): AsyncIterable<string> => {
  const { tokens } = picomatch.scan(glob, { tokens: true, parts: true }) as { tokens: TToken[] }
  const isFullMatch = picomatch(glob)
  let hasInfiniteDepthGlob = false

  const processDir = (dirPath: string, tokenIndex: number): AsyncIterable<string> => ({
    async *[Symbol.asyncIterator]() {
      const token = tokens[tokenIndex]

      // no need to read dir if token is not a glob, it's possible to go there directly
      if (!token.isGlob) {
        const nextDirPath = join(dirPath, token.value)

        // skip ignored paths
        if (isPathIgnored(nextDirPath, negatedGlobs)) {
          return
        }

        try {
          await access(nextDirPath)

          // the end result, no more tokens
          if (tokenIndex === tokens.length - 1) {
            yield nextDirPath

            return
          }
        } catch (e) {
          // skip non-existing paths
          if (e.code === 'ENOENT') {
            return
          }

          throw e
        }

        // otherwise go deeper
        return yield* processDir(nextDirPath, tokenIndex + 1)
      }

      const dirents = await readdir(dirPath, readDirOptions)

      for (const dirent of dirents) {
        // token is a glob, but not `**`, and it doesn't match current dirent
        if (token.depth < Infinity && !picomatch.isMatch(dirent.name, token.value)) {
          continue
        }

        const direntPath = join(dirPath, dirent.name)

        // skip ignored paths
        if (isPathIgnored(direntPath, negatedGlobs)) {
          continue
        }

        // special `**` glob, has infinite depth
        if (token.depth === Infinity) {
          hasInfiniteDepthGlob = true
        }

        // always try to "full match" when in infinite depth mode, end result could be anywhere
        if (hasInfiniteDepthGlob && isFullMatch(direntPath)) {
          yield direntPath
          continue
        }

        // dirent must be the end result at this point already when it's the last token
        if (tokenIndex === tokens.length - 1) {
          yield direntPath
          continue
        }

        // go deeper if it reached this with no results, must guarantee that `tokenIndex`
        // doesn't increment endlessly when in infinite depth mode
        if (dirent.isDirectory()) {
          yield* processDir(direntPath, hasInfiniteDepthGlob ? tokenIndex : tokenIndex + 1)
        }
      }
    },
  })

  return processDir('.', 0)
}

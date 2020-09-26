import plugin from '@start/plugin'
import type { StartFile } from '@start/plugin'

export default (glob: string | string[]) =>
  plugin('findGitStaged', ({ logPath }) => async () => {
    const path = await import('path')
    const { EOL } = await import('os')
    const { spawnChildProcess } = await import('spown')
    const { default: multimatch } = await import('multimatch')

    const { stdout } = await spawnChildProcess('git diff --cached --name-only --diff-filter=ACM')
    const gitFiles = stdout.split(EOL)
    const matchedFiles = multimatch(gitFiles, glob)

    return {
      files: matchedFiles
        .map((file) => path.resolve(file))
        .map((file): StartFile => {
          logPath(file)

          return {
            path: file,
          }
        }),
    }
  })

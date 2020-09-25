import type { THook } from '@auto/core'
import { spawnChildProcess } from 'spown'

export const writePublishTags: THook = async ({ packages }) => {
  for (const pkg of packages) {
    if (pkg.version === null) {
      continue
    }

    await spawnChildProcess(
      `git tag -a ${pkg.name}@${pkg.version} -m "${pkg.name}@${pkg.version}"`,
      {
        stdout: null,
        stderr: process.stderr,
      }
    )
  }
}

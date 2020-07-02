import { THook } from '@auto/core'
import execa from 'execa'

export const writePublishTags: THook = async ({ packages }) => {
  for (const pkg of packages) {
    if (pkg.version === null) {
      continue
    }

    await execa(
      'git',
      [
        'tag',
        '-a',
        `${pkg.name}@${pkg.version}`,
        '-m',
        `${pkg.name}@${pkg.version}`,
      ],
      {
        stdout: 'ignore',
        stderr: 'inherit',
      }
    )
  }
}

import type { THook, TPackageRelease, TMessage, TLogReleaseType } from '@auto/core'
import { isString } from 'tsfn'
import type { TReadonly } from 'tsfn'
import { writeChangelog } from './write-changelog'

export const writeChangelogFiles: THook = async ({ packages, prefixes }) => {
  const compileLog = (pkg: TReadonly<TPackageRelease>): string => {
    let messages = (pkg.messages ?? []) as TMessage<TLogReleaseType>[]

    if (pkg.deps !== null && pkg.type !== 'initial') {
      const depNames = Object.keys(pkg.deps)
        .filter((name) => Boolean(packages.find((pkg) => pkg.name === name)?.type !== 'initial'))

      if (depNames.length > 0) {
        messages = messages.concat({
          type: 'dependencies',
          message: `update dependencies \`${depNames.join('`, `')}\``,
        })
      }
    }

    const messagesStr = messages
      .map((msg) => {
        let log = `* ${prefixes[msg.type]} ${msg.message}`

        if (isString(msg.description)) {
          log += `\n\n  \`\`\`\n  ${msg.description.replace(/\n/g, '\n  ')}\n  \`\`\``
        }

        return log
      })
      .join('\n\n')

    return `## v${pkg.version}\n\n${messagesStr}\n`
  }

  for (const pkg of packages) {
    if (pkg.type === null || pkg.version === null) {
      continue
    }

    await writeChangelog(compileLog(pkg), pkg.dir)
  }
}

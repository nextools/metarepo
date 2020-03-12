import { THook, TPackageRelease, TMessage, TLogReleaseType, TRequiredPrefixes } from '@auto/core'
import pAll from 'p-all'
import { TReadonly, isString } from 'tsfn'
import { writeChangelog } from './write-changelog'

const compileLog = (pkg: TReadonly<TPackageRelease>, prefixes: TReadonly<TRequiredPrefixes>): string => {
  let messages = (pkg.messages || []) as TMessage<TLogReleaseType>[]
  const hasInitial = messages.findIndex((item) => item.type === 'initial') >= 0

  if (pkg.deps !== null && !hasInitial) {
    messages = messages.concat({
      type: 'dependencies',
      message: `update dependencies \`${Object.keys(pkg.deps).join('`, `')}\``,
    })
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

export const writeChangelogFiles: THook = async ({ packages, prefixes }) => {
  await pAll(
    packages
      .filter((pkg) => pkg.type !== null && pkg.version !== null)
      .map((pkg) => () => writeChangelog(
        compileLog(pkg, prefixes),
        pkg.dir
      )),
    { concurrency: 4 }
  )
}

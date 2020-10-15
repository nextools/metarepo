import type { TReadonly } from 'tsfn'
import type { TPackageBumpMap, TPackageBump } from '../bump/types'
import type { TMessage, TLogReleaseType, TRequiredPrefixes, TGitMessageMap } from '../types'
import { isResolvedReleaseType } from '../utils'
import { log } from './log'

export const promptLog = (packages: TReadonly<TPackageBumpMap>, gitBumps: TReadonly<TGitMessageMap>, prefixes: TReadonly<TRequiredPrefixes>): void => {
  const compileMessages = (name: string, pkg: TReadonly<TPackageBump>): string => {
    let result = (gitBumps.get(name) ?? []) as TMessage<TLogReleaseType>[]

    if (pkg.deps !== null && pkg.type !== 'initial') {
      const depNames = Object.keys(pkg.deps)
        .filter((name) => isResolvedReleaseType(packages.get(name)?.type))

      if (depNames.length > 0) {
        result = result.concat({
          type: 'dependencies',
          message: `update dependencies \`${depNames.join('`, `')}\``,
        })
      }
    }

    return result
      .map((message) => `* ${prefixes[message.type]} ${message.message}`)
      .join('\n')
  }

  for (const [name, pkg] of packages) {
    if (pkg.type === null || pkg.version === null) {
      continue
    }

    log('')
    log(`${name} → ${pkg.type} → v${pkg.version}`)
    log(compileMessages(name, pkg))
  }

  log('')
}

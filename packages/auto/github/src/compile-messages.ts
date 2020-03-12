import { TPackageRelease, TMessage, TLogReleaseType, TRequiredPrefixes } from '@auto/core'
import { TReadonly } from 'tsfn'

export const compileMessages = (packageRelease: TReadonly<TPackageRelease>, prefixes: TReadonly<TRequiredPrefixes>): string => {
  let result = (packageRelease.messages || []) as TMessage<TLogReleaseType>[]
  const hasInitial = result.findIndex((item) => item.type === 'initial') >= 0

  if (packageRelease.deps !== null && !hasInitial) {
    result = result.concat({
      type: 'dependencies',
      message: `update dependencies \`${Object.keys(packageRelease.deps).join('`, `')}\``,
    })
  }

  return result
    .map((message) => `* ${prefixes[message.type]} ${message.message}`)
    .join('\n')
}

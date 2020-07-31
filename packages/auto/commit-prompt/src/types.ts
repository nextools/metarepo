import type { TAutoConfig, TRequiredPrefixes } from '@auto/core'

export type TPrefixesWithTitles = {
  [k: string]: {
    title: string,
    value: string,
  },
}

export type TCommitConfig = {
  [k in keyof TRequiredPrefixes]: string
} & {
  [k: string]: string,
}

export type TCommitAutoConfig = TAutoConfig & {
  commit?: TCommitConfig,
}

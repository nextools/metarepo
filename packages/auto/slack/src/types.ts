import type { TReleaseType } from '@auto/core'

export type TSlackConfig = {
  token: string,
  channel: string,
  username: string,
  iconEmoji: string,
  colors: {
    [k in TReleaseType]: string
  },
}

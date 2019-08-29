import { TOptions as TCommonOptions } from '@x-ray/common-utils'

export type TOptions = TUserOptions & {
  dpr: number,
  width: number,
  height: number,
  webSocketDebuggerUrl: string,
}

export type TUserOptions = {
  dpr?: number,
  width?: number,
  height?: number,
} & TCommonOptions

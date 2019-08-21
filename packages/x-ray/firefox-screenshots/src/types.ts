import { TOptions as TCommonOptions } from '@x-ray/common-utils'

export type TOptions = TUserOptions & {
  width: number,
  height: number,
  dpr: number,
}

export type TUserOptions = {
  width?: number,
  height?: number,
} & TCommonOptions

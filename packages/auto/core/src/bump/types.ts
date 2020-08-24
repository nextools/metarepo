import type { TReleaseType } from '../types'

export type TPackageBump = {
  type: TReleaseType | null,
  version: string | null,
  deps: {
    [name: string]: string,
  } | null,
  devDeps: {
    [name: string]: string,
  } | null,
}

export type TPackageBumpMap = Map<string, TPackageBump>

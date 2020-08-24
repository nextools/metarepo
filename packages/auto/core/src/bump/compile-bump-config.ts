import type { TBumpConfig, TResolvedReleaseType } from '../types'

export const bumpTypes: TResolvedReleaseType[] = ['patch', 'minor', 'major']

const defaultAutoConfig: Required<TBumpConfig> = {
  shouldAlwaysBumpDependents: false,
}

export const compileBumpConfig = (rootConfig?: TBumpConfig, packageConfig?: TBumpConfig): Required<TBumpConfig> => {
  const result: Required<TBumpConfig> = {
    ...defaultAutoConfig,
    ...rootConfig,
    ...packageConfig,
  }

  return result
}

import { isUndefined } from 'tsfn'
import { TMetaFile } from './types'

export const prepareMeta = (metaFile: TMetaFile): void => {
  if (!isUndefined(metaFile.childrenConfig)) {
    Object.values(metaFile.childrenConfig.meta).forEach(prepareMeta)
  }

  if (!isUndefined(metaFile.config.required)) {
    Object.keys(metaFile.config.props).forEach((key) => {
      if (!metaFile.config.required!.includes(key)) {
        metaFile.config.props[key].unshift(undefined)
      }
    })
  }
}

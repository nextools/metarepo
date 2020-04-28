import { TStyle } from 'stili'
import { isNumber } from 'tsfn'
import { TMeta } from './types'

export const getContainerStyle = (options: TMeta['options']): TStyle => {
  const result: TStyle = {
    _webOnly: {
      display: options.hasOwnWidth ? 'inline-block' : 'flex',
    },
    backgroundColor: options.backgroundColor || '#fff',
  }

  if (isNumber(options.maxWidth)) {
    result.maxWidth = options.maxWidth
  }

  if (isNumber(options.overflow)) {
    result.paddingTop = options.overflow
    result.paddingBottom = options.overflow
    result.paddingLeft = options.overflow
    result.paddingRight = options.overflow
  }

  if (isNumber(options.overflowTop)) {
    result.paddingTop = options.overflowTop
  }

  if (isNumber(options.overflowBottom)) {
    result.paddingBottom = options.overflowBottom
  }

  if (isNumber(options.overflowLeft)) {
    result.paddingLeft = options.overflowLeft
  }

  if (isNumber(options.overflowRight)) {
    result.paddingRight = options.overflowRight
  }

  return result
}

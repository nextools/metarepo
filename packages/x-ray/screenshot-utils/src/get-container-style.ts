import { TStyle } from 'stili'
import { isNumber } from 'tsfn'
import { TMeta } from './types'

export const getContainerStyle = (options: TMeta['options']): TStyle => {
  const result: TStyle = {
    display: options.hasOwnWidth ? 'inline-block' : 'flex',
    backgroundColor: options.backgroundColor || '#fff',
  }

  if (isNumber(options.maxWidth)) {
    result.maxWidth = `${options.maxWidth}px`
  }

  if (isNumber(options.overflow)) {
    result.padding = `${options.overflow}px`
  }

  if (isNumber(options.overflowTop)) {
    result.paddingTop = `${options.overflowTop}px`
  }

  if (isNumber(options.overflowBottom)) {
    result.paddingBottom = `${options.overflowBottom}px`
  }

  if (isNumber(options.overflowLeft)) {
    result.paddingLeft = `${options.overflowLeft}px`
  }

  if (isNumber(options.overflowRight)) {
    result.paddingRight = `${options.overflowRight}px`
  }

  return result
}

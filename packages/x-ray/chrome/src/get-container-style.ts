import { CSSProperties } from 'react'
import { isNumber } from 'tsfn'
import { TExampleOptions } from './types'

export const getContainerStyle = (userOptions?: TExampleOptions): CSSProperties => {
  const options: TExampleOptions = {
    hasOwnWidth: false,
    backgroundColor: '#fff',
    ...userOptions,
  }

  const result: CSSProperties = {
    display: options.hasOwnWidth ? 'inline-block' : 'flex',
    backgroundColor: options.backgroundColor ?? '#fff',
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

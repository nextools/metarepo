import React, { ReactElement } from 'react'
import { component, startWithType, onLayout } from 'refun'
import { TStyle } from 'stili'
import { isNumber, isFunction } from 'tsfn'

const parentStyle: TStyle = {
  display: 'flex',
}

const round = (value: number) => Math.round(value * 1000) / 1000

export type TSize = {
  width?: number,
  height?: number,
  onWidthChange?: (width: number) => void,
  onHeightChange?: (height: number) => void,
  children: ReactElement,
}

export const Size = component(
  startWithType<TSize>(),
  onLayout('ref', (ref: HTMLDivElement, { width, height, onWidthChange, onHeightChange }) => {
    const shouldMeasureWidth = isNumber(width) && isFunction(onWidthChange)
    const shouldMeasureHeight = isNumber(height) && isFunction(onHeightChange)

    if (shouldMeasureWidth || shouldMeasureHeight) {
      const measuredWidth = round(ref.offsetWidth)
      const measuredHeight = round(ref.offsetHeight)

      if (shouldMeasureWidth && width !== measuredWidth) {
        onWidthChange!(measuredWidth)
      }

      if (shouldMeasureHeight && height !== measuredHeight) {
        onHeightChange!(measuredHeight)
      }
    }
  })
)(({ ref, children }) => (
  <div ref={ref} style={parentStyle}>
    {children}
  </div>
))

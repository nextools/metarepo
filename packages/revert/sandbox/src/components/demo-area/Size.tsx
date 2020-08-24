import React from 'react'
import type { ReactElement } from 'react'
import { component, startWithType, mapRef } from 'refun'
import { isNumber, isFunction } from 'tsfn'
import { onLayout } from '../on-layout'

const parentStyle = {
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
  mapRef('ref', null as null | HTMLDivElement),
  onLayout(({ ref, width, height, onWidthChange, onHeightChange }) => {
    const shouldMeasureWidth = isNumber(width) && isFunction(onWidthChange)
    const shouldMeasureHeight = isNumber(height) && isFunction(onHeightChange)

    if (ref.current !== null && (shouldMeasureWidth || shouldMeasureHeight)) {
      const measuredWidth = round(ref.current.offsetWidth)
      const measuredHeight = round(ref.current.offsetHeight)

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

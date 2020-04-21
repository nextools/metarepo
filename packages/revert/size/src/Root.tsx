import React from 'react'
import { component, startWithType, mapWithPropsMemo, onLayout, mapRef } from 'refun'
import { normalizeStyle, TStyle } from 'stili'
import { isFunction, isNumber } from 'tsfn'
import { round } from './round'
import { TSize } from './types'

export const Size = component(
  startWithType<TSize>(),
  mapWithPropsMemo(({ left, top, maxWidth, maxHeight }) => {
    const parentStyle: TStyle = {
      display: 'flex',
      left: 0,
      top: 0,
      position: 'absolute',
    }
    const childStyle: TStyle = {
      flex: '0 0 auto',
    }

    if (isNumber(left)) {
      parentStyle.left = left
    }

    if (isNumber(top)) {
      parentStyle.top = top
    }

    if (isNumber(maxWidth) && maxWidth > 0) {
      childStyle.maxWidth = maxWidth
    }

    if (isNumber(maxHeight) && maxHeight > 0) {
      childStyle.maxHeight = maxHeight
    }

    return {
      parentStyle: normalizeStyle(parentStyle),
      childStyle: normalizeStyle(childStyle),
    }
  }, ['maxWidth', 'maxHeight', 'left', 'top']),
  mapRef('ref', null as HTMLDivElement | null),
  onLayout(({ ref, width, height, onWidthChange, onHeightChange }) => {
    if (ref.current === null) {
      return
    }

    const shouldMeasureWidth = isNumber(width) && isFunction(onWidthChange)
    const shouldMeasureHeight = isNumber(height) && isFunction(onHeightChange)

    if (shouldMeasureWidth || shouldMeasureHeight) {
      const rect = ref.current.firstElementChild!.getBoundingClientRect()

      const measuredWidth = round(rect.width)
      const measuredHeight = round(rect.height)

      if (shouldMeasureWidth && width !== measuredWidth) {
        onWidthChange!(measuredWidth)
      }

      if (shouldMeasureHeight && height !== measuredHeight) {
        onHeightChange!(measuredHeight)
      }
    }
  }, ['ref', 'width', 'height', 'onWidthChange', 'onHeightChange'])
)(({ ref, parentStyle, childStyle, children }) => (
  <div style={parentStyle}>
    <div style={childStyle} ref={ref}>
      {children}
    </div>
  </div>
))

Size.displayName = 'Size'

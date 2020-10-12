import React from 'react'
import type { CSSProperties } from 'react'
import { component, startWithType, mapWithPropsMemo, mapRef } from 'refun'
import { isFunction, isNumber, UNDEFINED } from 'tsfn'
import { onLayout } from './on-layout'
import { round } from './round'
import type { TPrimitiveSize } from './types'

export const PrimitiveSize = component(
  startWithType<TPrimitiveSize>(),
  mapWithPropsMemo(({
    left = 0,
    top = 0,
    width,
    maxWidth = 0,
    shouldPreventWrap = false,
    onWidthChange,
  }) => {
    const parentStyle: CSSProperties = {
      position: 'absolute',
      left,
      top,
      width: 'max-content',
    }

    if (shouldPreventWrap) {
      parentStyle.display = 'flex'
    }

    if (onWidthChange === UNDEFINED) {
      parentStyle.width = width
    }

    if (maxWidth > 0) {
      parentStyle.maxWidth = maxWidth
    }

    return {
      parentStyle,
    }
  }, ['maxWidth', 'left', 'top', 'shouldPreventWrap', 'width', 'onWidthChange']),
  mapRef('ref', null as HTMLDivElement | null),
  onLayout(({ ref, width, height, onWidthChange, onHeightChange }) => {
    if (ref.current === null) {
      return
    }

    const shouldMeasureWidth = isNumber(width) && isFunction(onWidthChange)
    const shouldMeasureHeight = isNumber(height) && isFunction(onHeightChange)
    const children = ref.current.children
    let {
      top,
      left,
      right,
      bottom,
    } = (children[0] as HTMLElement).getBoundingClientRect()

    for (let i = 1; i < children.length; ++i) {
      const child = children[i] as HTMLElement
      const rect = child.getBoundingClientRect()

      left = Math.min(left, rect.left)
      top = Math.min(top, rect.top)
      right = Math.max(right, rect.right)
      bottom = Math.max(bottom, rect.bottom)
    }

    const measuredWidth = round(right - left)
    const measuredHeight = round(bottom - top)

    if (shouldMeasureWidth && width !== measuredWidth) {
      console.log('SIZE_W', width, measuredWidth)
      onWidthChange!(measuredWidth)
    }

    if (shouldMeasureHeight && height !== measuredHeight) {
      console.log('SIZE_H', height, measuredHeight)
      onHeightChange!(measuredHeight)
    }
  })
)(({ ref, parentStyle, children }) => (
  <div style={parentStyle} ref={ref}>
    {children}
  </div>
))

PrimitiveSize.displayName = 'PrimitiveSize'

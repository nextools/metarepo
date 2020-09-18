import React from 'react'
import type { CSSProperties } from 'react'
import { component, startWithType, mapWithPropsMemo, mapRef } from 'refun'
import { isFunction, isNumber, isUndefined } from 'tsfn'
import { onLayout } from './on-layout'
import type { TSize } from './types'

export const Size = component(
  startWithType<TSize>(),
  mapWithPropsMemo(({
    left = 0,
    top = 0,
    width,
    maxWidth = 0,
    maxHeight = 0,
    shouldPreventWrap = false,
    onWidthChange,
  }) => {
    const parentStyle: CSSProperties = {
      display: 'flex',
      position: 'absolute',
      left,
      top,
      width,
    }
    const childStyle: CSSProperties = {
      flex: '0 0 auto',
    }

    if (isUndefined(onWidthChange)) {
      childStyle.flex = '1'
    }

    if (maxWidth > 0) {
      childStyle.maxWidth = maxWidth
    }

    if (maxHeight > 0) {
      childStyle.maxHeight = maxHeight
    }

    if (shouldPreventWrap) {
      childStyle.display = 'flex'
    }

    return {
      parentStyle,
      childStyle,
    }
  }, ['maxWidth', 'maxHeight', 'left', 'top', 'shouldPreventWrap', 'width', 'onWidthChange']),
  mapRef('ref', null as HTMLDivElement | null),
  onLayout(({ ref, width, height, onWidthChange, onHeightChange }) => {
    if (ref.current === null) {
      return
    }

    if (isNumber(width) && isFunction(onWidthChange)) {
      const measuredWidth = ref.current.offsetWidth

      if (width !== measuredWidth) {
        onWidthChange(measuredWidth)
      }
    }

    if (isNumber(height) && isFunction(onHeightChange)) {
      const measuredHeight = ref.current.offsetHeight

      if (height !== measuredHeight) {
        onHeightChange(measuredHeight)
      }
    }
  })
)(({ ref, parentStyle, childStyle, children }) => (
  <div style={parentStyle}>
    <div style={childStyle} ref={ref}>
      {children}
    </div>
  </div>
))

Size.displayName = 'Size'

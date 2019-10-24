import React from 'react'
import { component, startWithType } from 'refun'
import { normalizeStyle } from 'stili'
import { isFunction, isNumber } from 'tsfn'
import { round } from './round'
import { onLayout } from './on-layout'
import { TSize } from './types'

const style = normalizeStyle({
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 0,
  flexShrink: 0,
  alignSelf: 'flex-start',
})

export const Size = component(
  startWithType<TSize>(),
  onLayout('ref', (ref: HTMLDivElement, { width, height, onWidthChange, onHeightChange, onChange }) => {
    // prevent hasWidthChanged if width is not a number
    const newWidth = isNumber(width) ? round(ref.offsetWidth) : width!
    // prevent hasHeightChaged if height is not a number
    const newHeight = isNumber(height) ? round(ref.offsetHeight) : height!
    const hasWidthChanged = width !== newWidth
    const hasHeightChaged = height !== newHeight

    if (hasWidthChanged && isFunction(onWidthChange)) {
      onWidthChange(newWidth)
    }

    if (hasHeightChaged && isFunction(onHeightChange)) {
      onHeightChange(newHeight)
    }

    if ((hasWidthChanged || hasHeightChaged) && isFunction(onChange)) {
      onChange({ width: newWidth, height: newHeight })
    }
  })
)(({ ref, children }) => (
  <div style={style} ref={ref}>{children}</div>
))

Size.displayName = 'Size'

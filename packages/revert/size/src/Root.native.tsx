import React from 'react'
import { View, LayoutChangeEvent } from 'react-native'
import { component, mapHandlers, startWithType, mapWithPropsMemo } from 'refun'
import { isFunction, isNumber } from 'tsfn'
import { normalizeStyle, TStyle } from 'stili'
import { round } from './round'
import { TSize } from './types'

export const Size = component(
  startWithType<TSize>(),
  mapWithPropsMemo(({ left, top, maxWidth, maxHeight }) => {
    const style: TStyle = {
      flexDirection: 'row',
      flexGrow: 0,
      flexShrink: 0,
      alignSelf: 'flex-start',
      left: 0,
      top: 0,
    }

    if (isNumber(left)) {
      style.left = left
    }

    if (isNumber(top)) {
      style.top = top
    }

    if (isNumber(maxWidth)) {
      style.maxWidth = maxWidth
    }

    if (isNumber(maxHeight)) {
      style.maxHeight = maxHeight
    }

    return {
      style: normalizeStyle(style),
    }
  }, ['left', 'top', 'maxWidth', 'maxHeight']),
  mapHandlers({
    onLayout: ({ width, height, onWidthChange, onHeightChange }) => ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      const shouldMeasureWidth = isNumber(width) && isFunction(onWidthChange)
      const shouldMeasureHeight = isNumber(height) && isFunction(onHeightChange)

      if (shouldMeasureWidth || shouldMeasureHeight) {
        const measuredWidth = round(layout.width)
        const measuredHeight = round(layout.height)

        if (shouldMeasureWidth && width !== measuredWidth) {
          onWidthChange!(measuredWidth)
        }

        if (shouldMeasureHeight && height !== measuredHeight) {
          onHeightChange!(measuredHeight)
        }
      }
    },
  })
)(({ style, children, onLayout }) => (
  <View style={style} onLayout={onLayout}>{children}</View>
))

Size.displayName = 'Size'

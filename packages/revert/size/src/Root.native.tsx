import React from 'react'
import { View } from 'react-native'
import type { LayoutChangeEvent, ViewStyle } from 'react-native'
import { component, mapHandlers, startWithType, mapWithPropsMemo } from 'refun'
import { isFunction, isNumber } from 'tsfn'
import { round } from './round'
import type { TSize } from './types'

export const Size = component(
  startWithType<TSize>(),
  mapWithPropsMemo(({ left = 0, top = 0, maxWidth = 0, maxHeight = 0 }) => {
    const style: ViewStyle = {
      flexDirection: 'row',
      flexGrow: 0,
      flexShrink: 0,
      alignSelf: 'flex-start',
      left,
      top,
    }

    if (maxWidth > 0) {
      style.maxWidth = maxWidth
    }

    if (maxHeight > 0) {
      style.maxHeight = maxHeight
    }

    return {
      style,
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
  <View style={style} onLayout={onLayout}>
    {children}
  </View>
))

Size.displayName = 'Size'

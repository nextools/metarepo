import React from 'react'
import { View } from 'react-native'
import type { LayoutChangeEvent, ViewStyle } from 'react-native'
import { component, mapHandlers, startWithType, mapWithPropsMemo } from 'refun'
import { isFunction, isNumber, isUndefined } from 'tsfn'
import { round } from './round'
import type { TSize } from './types'

export const Size = component(
  startWithType<TSize>(),
  mapWithPropsMemo(({
    left = 0,
    top = 0,
    width,
    maxWidth = 0,
    maxHeight = 0,
    onWidthChange,
  }) => {
    const parentStyle: ViewStyle = {
      position: 'absolute',
      flexDirection: 'row',
      alignSelf: 'flex-start',
      left,
      top,
      width,
    }
    const childStyle: ViewStyle = {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: 'auto',
    }

    if (isUndefined(onWidthChange)) {
      childStyle.flexGrow = 1
    }

    if (maxWidth > 0) {
      childStyle.maxWidth = maxWidth
    }

    if (maxHeight > 0) {
      childStyle.maxHeight = maxHeight
    }

    return {
      parentStyle,
      childStyle,
    }
  }, ['left', 'top', 'width', 'maxWidth', 'maxHeight', 'onWidthChange']),
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
)(({ parentStyle, childStyle, children, onLayout }) => (
  <View style={parentStyle}>
    <View style={childStyle} onLayout={onLayout}>
      {children}
    </View>
  </View>
))

Size.displayName = 'Size'

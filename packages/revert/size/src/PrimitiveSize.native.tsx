import { Text, View } from 'react-native'
import type { LayoutChangeEvent, ViewStyle } from 'react-native'
import { component, mapHandlers, startWithType, mapWithPropsMemo } from 'refun'
import { UNDEFINED } from 'tsfn'
import { round } from './round'
import type { TPrimitiveSize } from './types'

export const PrimitiveSize = component(
  startWithType<TPrimitiveSize>(),
  mapWithPropsMemo(({
    left = 0,
    top = 0,
    width,
    maxWidth = 0,
    onWidthChange,
  }) => {
    const parentStyle: ViewStyle = {
      position: 'absolute',
      flexDirection: 'row',
      alignSelf: 'flex-start',
      left,
      top,
    }
    const childStyle: ViewStyle = {
      flexShrink: 1,
    }

    if (onWidthChange === UNDEFINED) {
      parentStyle.width = width
      childStyle.flexGrow = 1
    }

    if (maxWidth > 0) {
      parentStyle.maxWidth = maxWidth
    }

    return {
      parentStyle,
      childStyle,
    }
  }, ['left', 'top', 'width', 'maxWidth', 'onWidthChange']),
  mapHandlers({
    onLayout: ({ width, height, onWidthChange, onHeightChange }) => ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      const measuredWidth = round(layout.width)
      const measuredHeight = round(layout.height)

      if (onWidthChange !== UNDEFINED && width !== UNDEFINED && width !== measuredWidth) {
        onWidthChange(measuredWidth)
      }

      if (onHeightChange !== UNDEFINED && height !== UNDEFINED && height !== measuredHeight) {
        onHeightChange(measuredHeight)
      }
    },
  })
)(({ parentStyle, childStyle, children, onLayout }) => (
  <View style={parentStyle} onLayout={onLayout}>
    <Text style={childStyle}>
      {children}
    </Text>
  </View>
))

PrimitiveSize.displayName = 'PrimitiveSize'

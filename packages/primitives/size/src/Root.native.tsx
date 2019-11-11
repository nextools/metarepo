import React from 'react'
import { View, LayoutChangeEvent } from 'react-native'
import { component, mapHandlers, startWithType } from 'refun'
import { isFunction, isUndefined, isNumber } from 'tsfn'
import { normalizeStyle } from 'stili'
import { mapSizeUpdate } from './map-size-update'
import { round } from './round'
import { TSize } from './types'

const style = normalizeStyle({
  flexDirection: 'row',
  flexGrow: 0,
  flexShrink: 0,
  alignSelf: 'flex-start',
})

export const Size = component(
  startWithType<TSize>(),
  mapSizeUpdate(),
  mapHandlers({
    onLayout: ({ width, height, onWidthChange, onHeightChange, onChange, onSizeUpdate, sizeId }) => ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      // prevent hasWidthChanged if width is not a number
      const layoutWidth = isNumber(width) ? round(layout.width) : width!
      // prevent hasHeightChanged if height is not a number
      const layoutHeight = isNumber(height) ? round(layout.height) : height!
      const hasWidthChanged = layoutWidth !== width
      const hasHeightChanged = layoutHeight !== height

      if (hasWidthChanged && isFunction(onWidthChange)) {
        onWidthChange(layoutWidth)
      }

      if (hasHeightChanged && isFunction(onHeightChange)) {
        onHeightChange(layoutHeight)
      }

      if ((hasWidthChanged || hasHeightChanged) && isFunction(onChange)) {
        onChange({ width: layoutWidth, height: layoutHeight })
      }

      if (isFunction(onSizeUpdate) && (isUndefined(width) || !hasWidthChanged) && (isUndefined(height) || !hasHeightChanged)) {
        onSizeUpdate(sizeId.current)
      }
    },
  })
)(({ children, onLayout }) => (
  <View style={style} onLayout={onLayout}>{children}</View>
))

Size.displayName = 'Size'

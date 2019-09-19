import React from 'react'
import { View, LayoutChangeEvent } from 'react-native'
import { component, mapHandlers, startWithType, mapContext, onMount, onUpdate } from 'refun'
import { isFunction, isUndefined } from 'tsfn'
import { normalizeStyle } from 'stili'
import { pipe } from '@psxcode/compose'
import { SizeContext, TSizeContext } from './Context'
import { TSize } from './types'

const style = normalizeStyle({
  flexDirection: 'row',
  flexGrow: 0,
  flexShrink: 0,
  alignSelf: 'flex-start',
})

const mapSizeUpdate = <P extends TSize> () => {
  if (process.env.NODE_ENV !== 'production') {
    return pipe(
      startWithType<P & TSize>(),
      mapContext(SizeContext),
      onMount(({ onSizeMount }) => {
        if (isFunction(onSizeMount)) {
          onSizeMount()
        }
      }),
      onUpdate(({ onSizeUpdate }) => {
        if (isFunction(onSizeUpdate)) {
          onSizeUpdate()
        }
      }, ['width', 'height'])
    )
  }

  return (props: P) => props as P & TSizeContext
}

export const Size = component(
  startWithType<TSize>(),
  mapSizeUpdate(),
  mapHandlers({
    onLayout: ({ width, height, onWidthChange, onHeightChange, onChange, onSizeUpdate }) => ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      const layoutWidth = Math.round(layout.width * 1000) / 1000
      const layoutHeight = Math.round(layout.height * 1000) / 1000
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
        onSizeUpdate()
      }
    },
  })
)(({ children, onLayout }) => (
  <View style={style} onLayout={onLayout}>{children}</View>
))

Size.displayName = 'Size'

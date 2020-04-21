import React from 'react'
import { View, ViewProps } from 'react-native'
import { component, startWithType, mapProps } from 'refun'
import { normalizeStyle, TStyle } from 'stili'
import { isNumber } from 'tsfn'
import { colorToString } from '@revert/color'
import { TPrimitiveBorder } from './types'

export const PrimitiveBorder = component(
  startWithType<TPrimitiveBorder>(),
  mapProps(({
    color,
    borderWidth,
    borderLeftWidth: leftWidth,
    borderTopWidth: topWidth,
    borderRightWidth: rightWidth,
    borderBottomWidth: bottomWidth,
    radius,
    overflow = 0,
    left = 0,
    top = 0,
    width,
    height,
  }) => {
    const styles: TStyle = {
      flexDirection: 'row',
      position: 'absolute',
      left: left - overflow,
      top: top - overflow,
      right: -overflow,
      bottom: -overflow,
      borderTopWidth: borderWidth,
      borderLeftWidth: borderWidth,
      borderRightWidth: borderWidth,
      borderBottomWidth: borderWidth,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      borderBottomLeftRadius: radius,
      borderColor: colorToString(color),
    }

    if (isNumber(width)) {
      styles.width = width + overflow * 2
    }

    if (isNumber(height)) {
      styles.height = height + overflow * 2
    }

    if (isNumber(leftWidth)) {
      styles.borderLeftWidth = leftWidth
    }

    if (isNumber(topWidth)) {
      styles.borderTopWidth = topWidth
    }

    if (isNumber(rightWidth)) {
      styles.borderRightWidth = rightWidth
    }

    if (isNumber(bottomWidth)) {
      styles.borderBottomWidth = bottomWidth
    }

    const props: ViewProps = {
      style: normalizeStyle(styles),
      pointerEvents: 'none',
    }

    return props
  })
)((props) => (
  <View {...props}/>
))

PrimitiveBorder.displayName = 'PrimitiveBorder'

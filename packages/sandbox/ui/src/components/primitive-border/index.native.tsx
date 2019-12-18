import React from 'react'
import { View, ViewProps } from 'react-native'
import { component, startWithType, mapProps, mapDefaultProps } from 'refun'
import { normalizeStyle, TStyle } from 'stili'
import { isNumber } from 'tsfn'
import { colorToString } from '../../colors'
import { TPrimitiveBorder } from './types'

export * from './types'

export const PrimitiveBorder = component(
  startWithType<TPrimitiveBorder>(),
  mapDefaultProps({
    overflow: 0,
  }),
  mapProps(({
    color,
    width,
    leftWidth,
    topWidth,
    rightWidth,
    bottomWidth,
    radius,
    overflow,
  }) => {
    const styles: TStyle = {
      flexDirection: 'row',
      position: 'absolute',
      left: -overflow,
      top: -overflow,
      right: -overflow,
      bottom: -overflow,
      borderTopWidth: width,
      borderLeftWidth: width,
      borderRightWidth: width,
      borderBottomWidth: width,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      borderBottomLeftRadius: radius,
      borderColor: colorToString(color),
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

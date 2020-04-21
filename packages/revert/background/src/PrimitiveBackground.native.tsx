import React from 'react'
import { View, ViewProps } from 'react-native'
import { component, startWithType, mapProps } from 'refun'
import { normalizeStyle, TStyle } from 'stili'
import { colorToString } from '@revert/color'
import { isNumber } from 'tsfn'
import { TPrimitiveBackground } from './types'

export const PrimitiveBackground = component(
  startWithType<TPrimitiveBackground>(),
  mapProps(({
    color,
    radius,
    left = 0,
    top = 0,
    overflow = 0,
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
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      borderBottomLeftRadius: radius,
      backgroundColor: colorToString(color),
    }

    if (isNumber(width)) {
      styles.width = width + overflow * 2
    }

    if (isNumber(height)) {
      styles.height = height + overflow * 2
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

PrimitiveBackground.displayName = 'PrimitiveBackground'

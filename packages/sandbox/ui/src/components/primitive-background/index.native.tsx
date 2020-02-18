import React from 'react'
import { View, ViewProps } from 'react-native'
import { component, startWithType, mapProps, mapDefaultProps } from 'refun'
import { normalizeStyle, TStyle } from 'stili'
import { colorToString } from '../../colors'
import { TPrimitiveBackground } from './types'

export * from './types'

export const PrimitiveBackground = component(
  startWithType<TPrimitiveBackground>(),
  mapDefaultProps({
    overflow: 0,
  }),
  mapProps(({
    color,
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
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      borderBottomLeftRadius: radius,
      backgroundColor: colorToString(color),
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

import { colorToString } from '@revert/color'
import { View } from 'react-native'
import type { ViewProps, ViewStyle } from 'react-native'
import { component, startWithType, mapProps } from 'refun'
import { isNumber } from 'tsfn'
import type { TPrimitiveBackground } from './types'

export const PrimitiveBackground = component(
  startWithType<TPrimitiveBackground>(),
  mapProps(({
    color = 0,
    radius,
    left = 0,
    top = 0,
    overflow = 0,
    width,
    height,
  }) => {
    const style: ViewStyle = {
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
      style.width = width + overflow * 2
    }

    if (isNumber(height)) {
      style.height = height + overflow * 2
    }

    const props: ViewProps = {
      style,
      pointerEvents: 'none',
    }

    return props
  })
)((props) => (
  <View {...props}/>
))

PrimitiveBackground.displayName = 'PrimitiveBackground'

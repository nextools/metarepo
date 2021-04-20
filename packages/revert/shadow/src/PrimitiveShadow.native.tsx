import { colorToString } from '@revert/color'
import { View } from 'react-native'
import type { ViewProps, ViewStyle } from 'react-native'
import { component, startWithType, mapProps } from 'refun'
import { isNumber } from 'tsfn'
import type { TPrimitiveShadow } from './types'

export const PrimitiveShadow = component(
  startWithType<TPrimitiveShadow>(),
  mapProps(({
    left = 0,
    top = 0,
    width,
    height,
    color = 0,
    radius,
    overflow = 0,
  }) => {
    const style: ViewStyle = {
      flexDirection: 'row',
      position: 'absolute',
      left: left - overflow,
      top: top - overflow,
      right: -overflow,
      bottom: -overflow,
      borderRadius: radius,
      borderColor: colorToString(color),
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

PrimitiveShadow.displayName = 'PrimitiveShadow'

import { View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { component, startWithType, mapWithProps } from 'refun'
import type { TPrimitiveLabel } from './types'

export const PrimitiveLabel = component(
  startWithType<TPrimitiveLabel>(),
  mapWithProps(({
    left = 0,
    top = 0,
    width,
    height,
  }) => {
    const style: ViewStyle = {
      position: 'absolute',
      left,
      top,
      width: width ?? '100%',
      height: height ?? '100%',
    }

    return {
      style,
    }
  })
)(({ style, children }) => (
  <View style={style}>
    {children}
  </View>
))

PrimitiveLabel.displayName = 'PrimitiveLabel'

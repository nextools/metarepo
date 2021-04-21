import { View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { component, startWithType, mapWithProps } from 'refun'
import { isNumber } from 'tsfn'
import type { TTransform } from './types'

export const PrimitiveTransform = component(
  startWithType<TTransform>(),
  mapWithProps(({
    x = 0,
    y = 0,
    rotate,
    scale,
  }) => {
    const style: ViewStyle = {
      flexDirection: 'row',
      flexGrow: 0,
      flexShrink: 0,
      alignSelf: 'flex-start',
      transform: [
        { translateX: x },
        { translateY: y },
      ],
    }

    if (isNumber(scale)) {
      style.transform!.push({ scale })
    }

    if (isNumber(rotate)) {
      style.transform!.push({ rotate: `${rotate}deg` })
    }

    return {
      style,
    }
  })
)(({ style, children }) => (
  <View style={style}>{children}</View>
))

PrimitiveTransform.displayName = 'PrimitiveTransform'

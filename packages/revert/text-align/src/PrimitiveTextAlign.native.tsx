import { Text } from 'react-native'
import type { TextStyle } from 'react-native'
import { component, mapWithPropsMemo, startWithType } from 'refun'
import type { TTextAlign } from './types'

export const PrimitiveTextAlign = component(
  startWithType<TTextAlign>(),
  mapWithPropsMemo(({ align }) => {
    const style: TextStyle = {
      flexGrow: 1,
      flexShrink: 1,
      textAlign: align,
    }

    return {
      style,
    }
  }, ['align'])
)(({ style, children }) => (
  <Text style={style}>
    {children}
  </Text>
))

PrimitiveTextAlign.displayName = 'PrimitiveTextAlign'

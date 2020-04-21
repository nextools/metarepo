import React from 'react'
import { View } from 'react-native'
import { component, startWithType, mapWithProps, mapDefaultProps } from 'refun'
import { TStyle } from 'stili'
import { TPrimitiveLabel } from './types'

export const PrimitiveLabel = component(
  startWithType<TPrimitiveLabel>(),
  mapDefaultProps({
    top: 0,
    left: 0,
  }),
  mapWithProps(({ left, top, width, height }) => {
    const style: TStyle = {
      position: 'absolute',
      left,
      top,
      width: width || '100%',
      height: height || '100%',
      userSelect: 'none',
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

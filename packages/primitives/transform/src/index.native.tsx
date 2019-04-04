import React from 'react'
import { View, ViewStyle } from 'react-native'
import { component, startWithType, mapWithProps } from 'refun'
import { TTransformProps } from './types'

export * from './types'

const defaultStyles: ViewStyle = {
  display: 'flex',
  position: 'relative',
}

export const Transform = component(
  startWithType<TTransformProps>(),
  mapWithProps(({ x, y, rotate, scale }) => {
    const transform = []

    if (typeof x !== 'undefined') {
      transform.push({ translateX: x })
    }

    if (typeof y !== 'undefined') {
      transform.push({ translateY: y })
    }

    if (typeof scale !== 'undefined') {
      transform.push({ scale })
    }

    if (typeof rotate !== 'undefined') {
      transform.push({ rotate: `${rotate}deg` })
    }

    return {
      style: {
        ...defaultStyles,
        transform,
      },
    }
  })
)('Transform', ({ style, children }) => (
  <View style={style}>{children}</View>
))

import React from 'react'
import { View } from 'react-native'
import { component, startWithType, mapWithProps } from 'refun'
import { TStyle } from '@lada/prefix'
import { TTransformProps } from './types'

const defaultStyles: TStyle = {
  flexDirection: 'row',
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: 'auto',
  alignSelf: 'flex-start',
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

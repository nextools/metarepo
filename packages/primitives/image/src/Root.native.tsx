import React from 'react'
import { normalizeStyle } from 'stili'
import { component, startWithType, mapDefaultProps, mapWithProps } from 'refun'
import { Image as ImageRN } from 'react-native'
import { TImage } from './types'

export const Image = component(
  startWithType<TImage>(),
  mapDefaultProps({
    resizeMode: 'cover',
    borderRadius: 0,
  }),
  mapWithProps(({ borderRadius, resizeMode }) => ({
    style: normalizeStyle({
      borderRadius,
      resizeMode,
    }),
  }))
)(({ source, id, height, width, style }) => (
  <ImageRN
    testID={id}
    source={{ uri: source }}
    height={height}
    width={width}
    style={style}
  />
))

Image.displayName = 'Image'

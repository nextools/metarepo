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
)(({ source, id, height, width, style, onLoad, onError }) => (
  <ImageRN
    testID={id}
    source={{
      uri: source,
      width,
      height,
    }}
    style={style}
    onLoad={onLoad}
    onError={onError}
  />
))

Image.displayName = 'Image'

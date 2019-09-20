import React from 'react'
import { normalizeStyle } from 'stili'
import { component, startWithType, mapDefaultProps, mapWithProps } from 'refun'
import { Image as ImageRN } from 'react-native'
import { mapImageLoad } from './map-image-load'
import { TImage } from './types'

export const Image = component(
  startWithType<TImage>(),
  mapImageLoad(),
  mapDefaultProps({
    resizeMode: 'cover',
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
    fadeDuration={0}
    style={style}
    onLoad={onLoad}
    onError={onError}
  />
))

Image.displayName = 'Image'

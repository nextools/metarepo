import React from 'react'
import { Image as NativeImage } from 'react-native'
import type { ImageStyle } from 'react-native'
import { component, startWithType, mapWithProps } from 'refun'
import type { TPrimitiveImage } from './types'

export const Image = component(
  startWithType<TPrimitiveImage>(),
  mapWithProps(({
    radius,
    bottomLeftRadius,
    bottomRightRadius,
    topLeftRadius,
    topRightRadius,
    resizeMode = 'cover',
  }) => {
    const style: ImageStyle = {
      borderRadius: radius,
      borderBottomLeftRadius: bottomLeftRadius,
      borderBottomRightRadius: bottomRightRadius,
      borderTopLeftRadius: topLeftRadius,
      borderTopRightRadius: topRightRadius,
      resizeMode,
    }

    return {
      style,
    }
  })
)(({ source, id, height, width, style, onLoad, onError }) => (
  <NativeImage
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

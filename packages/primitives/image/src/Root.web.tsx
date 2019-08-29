import React from 'react'
import { normalizeStyle } from 'stili'
import { component, startWithType, mapDefaultProps, mapWithProps } from 'refun'
import { TImage } from './types'

export const Image = component(
  startWithType<TImage>(),
  mapDefaultProps({
    resizeMode: 'cover',
    borderRadius: 0,
  }),
  mapWithProps(({ borderRadius, resizeMode }) => ({
    style: normalizeStyle({
      borderRadius: `${borderRadius}px`,
      objectFit: resizeMode,
    }),
  }))
)(({ alt, source, id, height, width, style, onLoad, onError }) => (
  <img
    id={id}
    alt={alt}
    src={source}
    height={height}
    width={width}
    style={style}
    onLoad={onLoad}
    onError={onError}
  />
))

Image.displayName = 'Image'

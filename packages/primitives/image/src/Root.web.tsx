import React from 'react'
import { normalizeStyle, TStyle } from 'stili'
import { component, startWithType, mapDefaultProps, mapWithProps } from 'refun'
import { isNumber } from 'tsfn'
import { TImage } from './types'

export const Image = component(
  startWithType<TImage>(),
  mapDefaultProps({
    resizeMode: 'cover',
  }),
  mapWithProps(({ borderRadius, resizeMode }) => {
    const style: TStyle = {
      objectFit: resizeMode,
    }

    if (isNumber(borderRadius)) {
      style.borderRadius = `${borderRadius}px`
    }

    return {
      style: normalizeStyle(style),
    }
  })
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

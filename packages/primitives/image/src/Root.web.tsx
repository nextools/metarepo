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
  mapWithProps(({ bottomLeftRadius, bottomRightRadius, topLeftRadius, topRightRadius, resizeMode }) => {
    const style: TStyle = {
      objectFit: resizeMode,
    }

    if (isNumber(bottomLeftRadius)) {
      style.borderBottomLeftRadius = `${bottomLeftRadius}px`
    }

    if (isNumber(bottomRightRadius)) {
      style.borderBottomRightRadius = `${bottomRightRadius}px`
    }

    if (isNumber(topLeftRadius)) {
      style.borderTopLeftRadius = `${topLeftRadius}px`
    }

    if (isNumber(topRightRadius)) {
      style.borderTopRightRadius = `${topRightRadius}px`
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

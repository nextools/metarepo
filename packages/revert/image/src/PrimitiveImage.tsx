import React from 'react'
import type { CSSProperties } from 'react'
import { component, startWithType, mapWithProps } from 'refun'
import type { TPrimitiveImage } from './types'

export const PrimitiveImage = component(
  startWithType<TPrimitiveImage>(),
  mapWithProps(({
    bottomLeftRadius,
    bottomRightRadius,
    topLeftRadius,
    topRightRadius,
    radius,
    resizeMode = 'cover',
  }) => {
    const style: CSSProperties = {
      borderRadius: radius,
      borderBottomLeftRadius: bottomLeftRadius,
      borderBottomRightRadius: bottomRightRadius,
      borderTopLeftRadius: topLeftRadius,
      borderTopRightRadius: topRightRadius,
      objectFit: resizeMode,
    }

    return {
      style,
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

PrimitiveImage.displayName = 'PrimitiveImage'

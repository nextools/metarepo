import type { CSSProperties } from 'react'
import { component, startWithType, mapWithProps, mapContext, mapHandlers } from 'refun'
import { ImageContext } from './ImageContext'
import type { TPrimitiveImage } from './types'

export const PrimitiveImage = component(
  startWithType<TPrimitiveImage>(),
  mapWithProps(({
    width,
    height,
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
      width,
      height,
      verticalAlign: 'bottom',
      display: 'inline-block',
    }

    return {
      style,
    }
  }),
  mapContext(ImageContext),
  mapHandlers({
    onLoad: ({ onImageLoad, onLoad }) => () => {
      onLoad?.()
      onImageLoad?.()
    },
    onError: ({ onImageError, onError }) => () => {
      onError?.()
      onImageError?.()
    },
  })
)(({ alt, source, id, style, onLoad, onError }) => (
  <img
    id={id}
    alt={alt}
    src={source}
    style={style}
    onLoad={onLoad}
    onError={onError}
  />
))

PrimitiveImage.displayName = 'PrimitiveImage'

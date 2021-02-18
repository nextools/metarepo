import { Image as NativeImage } from 'react-native'
import type { ImageStyle } from 'react-native'
import { component, startWithType, mapWithProps, mapContext, mapHandlers } from 'refun'
import { ImageContext } from './ImageContext'
import type { TPrimitiveImage } from './types'

export const PrimitiveImage = component(
  startWithType<TPrimitiveImage>(),
  mapWithProps(({
    width,
    height,
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
      width,
      height,
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

PrimitiveImage.displayName = 'PrimitiveImage'

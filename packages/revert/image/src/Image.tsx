import { Size } from '@revert/size'
import { component, startWithType, mapStateRef, mapHandlers } from 'refun'
import { isNumber } from 'tsfn'
import { PrimitiveImage } from './PrimitiveImage'
import type { TImage } from './types'

export const Image = component(
  startWithType<TImage>(),
  mapStateRef('state', 'rerender', () => 0, []),
  mapHandlers({
    onLoad: ({ width, height, rerender, onLoad }) => () => {
      if (!isNumber(width) || !isNumber(height)) {
        rerender()
      }

      onLoad?.()
    },
  })
)(({
  width,
  height,
  id,
  alt,
  source,
  resizeMode,
  radius,
  topLeftRadius,
  topRightRadius,
  bottomLeftRadius,
  bottomRightRadius,
  onLoad,
  onError,
}) => (
  <Size>
    <PrimitiveImage
      width={width}
      height={height}
      id={id}
      alt={alt}
      source={source}
      resizeMode={resizeMode}
      radius={radius}
      topLeftRadius={topLeftRadius}
      topRightRadius={topRightRadius}
      bottomLeftRadius={bottomLeftRadius}
      bottomRightRadius={bottomRightRadius}
      onLoad={onLoad}
      onError={onError}
    />
  </Size>
))

Image.displayName = 'Text'
Image.componentSymbol = Symbol('REVERT_IMAGE')

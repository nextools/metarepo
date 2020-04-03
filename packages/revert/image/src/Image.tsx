import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { InlineBlock } from '@revert/block'
import { LayoutContext } from '@revert/layout'
import { PrimitiveImage } from './PrimitiveImage'
import { TImage } from './types'

export const Image = component(
  startWithType<TImage>(),
  mapContext(LayoutContext)
)(({
  _width,
  _height,
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
  <InlineBlock>
    <PrimitiveImage
      width={_width}
      height={_height}
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
  </InlineBlock>
))

Image.displayName = 'Text'
Image.componentSymbol = Symbol('REVERT_IMAGE')

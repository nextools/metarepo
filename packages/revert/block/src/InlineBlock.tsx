import { LayoutContext } from '@revert/layout'
import { Size } from '@revert/size'
import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import type { TInlineBlock } from './types'

export const InlineBlock = component(
  startWithType<TInlineBlock>(),
  mapContext(LayoutContext)
)(({
  _left,
  _top,
  _width,
  _height,
  _maxWidth,
  _maxHeight,
  _onWidthChange,
  _onHeightChange,
  shouldPreventWrap,
  children,
}) => (
  <Size
    left={_left}
    top={_top}
    width={_width}
    height={_height}
    maxWidth={_maxWidth}
    maxHeight={_maxHeight}
    onWidthChange={_onWidthChange}
    onHeightChange={_onHeightChange}
    shouldPreventWrap={shouldPreventWrap}
  >
    {children}
  </Size>
))

InlineBlock.displayName = 'InlineBlock'
InlineBlock.componentSymbol = Symbol('REVERT_INLINE_BLOCK')

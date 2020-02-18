import React, { ReactElement } from 'react'
import { component, startWithType, mapContext } from 'refun'
import { Size } from '../size'
import { SYMBOL_SIZE_CONTENT } from '../../symbols'
import { LayoutContext } from '../layout-context'

export type TSizeContent = {
  children: ReactElement,
  shouldPreventWrap?: boolean,
}

export const SizeContent = component(
  startWithType<TSizeContent>(),
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
  children,
  shouldPreventWrap,
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

SizeContent.displayName = 'SizeContent'
SizeContent.componentSymbol = SYMBOL_SIZE_CONTENT

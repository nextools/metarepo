import React from 'react'
import { component, startWithType, mapContext, mapWithProps, mapDefaultProps, onLayout } from 'refun'
import { LayoutContext } from '@revert/layout'
import { PrimitiveBlock } from './PrimitiveBlock'

export type TBlock = {
  width?: number,
  height?: number,
  minWidth?: number,
  minHeight?: number,
  shouldIgnorePointerEvents?: boolean,
  shouldHideOverflow?: boolean,
}

export const Block = component(
  startWithType<TBlock>(),
  mapDefaultProps({
    minWidth: 0,
    minHeight: 0,
  }),
  mapContext(LayoutContext),
  onLayout(({ width, height, minWidth, minHeight, _onWidthChange, _onHeightChange }) => {
    _onWidthChange?.(width ?? minWidth)
    _onHeightChange?.(height ?? minHeight)
  }, ['width', 'minWidth', '_onWidthChange', 'height', 'minHeight', '_onHeightChange']),
  mapWithProps(({ width, _width, height, _height }) => ({
    width: width ?? _width,
    height: height ?? _height,
  }))
)(({
  _x,
  _y,
  _left,
  _top,
  width,
  height,
  shouldIgnorePointerEvents,
  shouldHideOverflow,
  children,
}) => (
  <PrimitiveBlock
    left={_left}
    top={_top}
    width={width}
    height={height}
    shouldIgnorePointerEvents={shouldIgnorePointerEvents}
    shouldHideOverflow={shouldHideOverflow}
  >
    <LayoutContext.Provider
      value={{
        _x,
        _y,
        _parentLeft: 0,
        _parentTop: 0,
        _parentWidth: width,
        _parentHeight: height,
        _left: 0,
        _top: 0,
        _width: width,
        _height: height,
      }}
    >
      {children}
    </LayoutContext.Provider>
  </PrimitiveBlock>
))

Block.displayName = 'Block'
Block.componentSymbol = Symbol('REVERT_BLOCK')

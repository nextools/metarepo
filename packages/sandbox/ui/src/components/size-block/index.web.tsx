import React from 'react'
import { component, startWithType, mapContext, onChange, mapWithProps, mapDefaultProps } from 'refun'
import { LayoutContext } from '../layout-context'
import { PrimitiveBlock } from '../primitive-block'

export type TSizeBlock = {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
  minWidth?: number,
  minHeight?: number,
  shouldIgnorePointerEvents?: boolean,
  shouldHideOverflow?: boolean,
}

export const SizeBlock = component(
  startWithType<TSizeBlock>(),
  mapDefaultProps({
    minWidth: 0,
    minHeight: 0,
  }),
  mapContext(LayoutContext),
  onChange(({ width, minWidth, _onWidthChange }) => {
    _onWidthChange?.(width ?? minWidth)
  }, ['width', 'minWidth', '_onWidthChange']),
  onChange(({ height, minHeight, _onHeightChange }) => {
    _onHeightChange?.(height ?? minHeight)
  }, ['height', 'minHeight', '_onHeightChange']),
  mapWithProps(({ _x, _y, left, _left, top, _top, width, _width, height, _height }) => ({
    left: left ?? _left,
    top: top ?? _top,
    width: width ?? _width,
    height: height ?? _height,
    x: left ? _x - _left + left : _x,
    y: top ? _y - _top + top : _y,
  }))
)(({
  x,
  y,
  left,
  top,
  width,
  height,
  shouldIgnorePointerEvents,
  shouldHideOverflow,
  children,
}) => (
  <PrimitiveBlock
    left={left}
    top={top}
    width={width}
    height={height}
    shouldIgnorePointerEvents={shouldIgnorePointerEvents}
    shouldHideOverflow={shouldHideOverflow}
  >
    <LayoutContext.Provider
      value={{
        _x: x,
        _y: y,
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

SizeBlock.displayName = 'SizeBlock'
SizeBlock.componentSymbol = Symbol('SIZE_BLOCK')

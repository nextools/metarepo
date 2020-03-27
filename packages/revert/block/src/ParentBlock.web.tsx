import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { LayoutContext } from '@revert/layout'
import { PrimitiveBlock } from './PrimitiveBlock'

export type TParentBlock = {
  shouldIgnorePointerEvents?: boolean,
}

export const ParentBlock = component(
  startWithType<TParentBlock>(),
  mapContext(LayoutContext)
)(({
  _x,
  _y,
  _parentLeft,
  _parentTop,
  _parentWidth,
  _parentHeight,
  _left,
  _top,
  _width,
  _height,
  _onWidthChange,
  _onHeightChange,
  _maxWidth,
  _maxHeight,
  shouldIgnorePointerEvents,
  children,
}) => (
  <PrimitiveBlock
    left={_parentLeft}
    top={_parentTop}
    width={_parentWidth}
    height={_parentHeight}
    shouldIgnorePointerEvents={shouldIgnorePointerEvents}
  >
    <LayoutContext.Provider
      value={{
        _x, // TODO _x - (_left - _parentLeft)
        _y,
        _parentLeft: 0,
        _parentTop: 0,
        _parentWidth,
        _parentHeight,
        _left: _left - _parentLeft,
        _top: _top - _parentTop,
        _width,
        _height,
        _onWidthChange,
        _onHeightChange,
        _maxWidth,
        _maxHeight,
      }}
    >
      {children}
    </LayoutContext.Provider>
  </PrimitiveBlock>
))

ParentBlock.displayName = 'ParentBlock'
ParentBlock.componentSymbol = Symbol('REVERT_PARENT_BLOCK')

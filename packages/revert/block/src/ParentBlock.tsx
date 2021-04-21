import { LayoutContext } from '@revert/layout'
import { component, startWithType, mapContext } from 'refun'
import { PrimitiveBlock } from './PrimitiveBlock'
import type { TParentBlock } from './types'

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
  id,
  onRef,
  shouldIgnorePointerEvents,
  children,
}) => (
  <PrimitiveBlock
    id={id}
    left={_parentLeft}
    top={_parentTop}
    width={_parentWidth}
    height={_parentHeight}
    onRef={onRef}
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

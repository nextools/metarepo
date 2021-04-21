import { LayoutContext } from '@revert/layout'
import { component, startWithType, mapContext, mapWithProps, mapDefaultProps, onLayout } from 'refun'
import { PrimitiveBlock } from './PrimitiveBlock'
import type { TBlock } from './types'

export const Block = component(
  startWithType<TBlock>(),
  mapDefaultProps({
    minWidth: 0,
    minHeight: 0,
  }),
  mapContext(LayoutContext),
  onLayout(({ width, minWidth, _onWidthChange }) => {
    _onWidthChange?.(width ?? minWidth)
  }, ['width', 'minWidth', '_onWidthChange']),
  onLayout(({ height, minHeight, _onHeightChange }) => {
    _onHeightChange?.(height ?? minHeight)
  }, ['height', 'minHeight', '_onHeightChange']),
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
  id,
  onRef,
  shouldIgnorePointerEvents,
  shouldHideOverflow,
  children,
}) => (
  <PrimitiveBlock
    id={id}
    left={_left}
    top={_top}
    width={width}
    height={height}
    onRef={onRef}
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

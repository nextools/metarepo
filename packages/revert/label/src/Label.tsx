import { LayoutContext } from '@revert/layout'
import { startWithType, component, mapContext } from 'refun'
import { PrimitiveLabel } from './PrimitiveLabel'
import type { TLabel } from './types'

export const Label = component(
  startWithType<TLabel>(),
  mapContext(LayoutContext)
)(({
  _x,
  _y,
  _left,
  _top,
  _width,
  _height,
  _maxWidth,
  _maxHeight,
  _parentLeft,
  _parentTop,
  _parentWidth,
  _parentHeight,
  _onWidthChange,
  _onHeightChange,
  children,
}) => (
  <PrimitiveLabel
    left={_parentLeft}
    top={_parentTop}
    width={_parentWidth}
    height={_parentHeight}
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
  </PrimitiveLabel>
))

Label.displayName = 'Label'
Label.componentSymbol = Symbol('REVERT_LABEL')

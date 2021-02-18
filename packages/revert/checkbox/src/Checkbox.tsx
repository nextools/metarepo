import { LayoutContext } from '@revert/layout'
import { component, startWithType, mapContext } from 'refun'
import { PrimitiveCheckbox } from './PrimitiveCheckbox'
import type { TCheckbox } from './types'

export const Checkbox = component(
  startWithType<TCheckbox>(),
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
  isChecked,
  onToggle,
  accessibilityLabel,
  id,
  isDisabled,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  onPressIn,
  onPressOut,
  children,
}) => (
  <PrimitiveCheckbox
    left={_parentLeft}
    top={_parentTop}
    width={_parentWidth}
    height={_parentHeight}
    isChecked={isChecked}
    onToggle={onToggle}
    accessibilityLabel={accessibilityLabel}
    id={id}
    isDisabled={isDisabled}
    onBlur={onBlur}
    onFocus={onFocus}
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
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
  </PrimitiveCheckbox>
))

Checkbox.displayName = 'Checkbox'
Checkbox.componentSymbol = Symbol('REVERT_CHECKBOX')

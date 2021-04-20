import { LayoutContext } from '@revert/layout'
import { component, startWithType, mapContext } from 'refun'
import { PrimitiveButton } from './PrimitiveButton'
import type { TButton } from './types'

export const Button = component(
  startWithType<TButton>(),
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
  accessibilityLabel,
  children,
  id,
  isDisabled,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  onPress,
  onPressIn,
  onPressOut,
}) => (
  <PrimitiveButton
    left={_parentLeft}
    top={_parentTop}
    width={_parentWidth}
    height={_parentHeight}
    id={id}
    accessibilityLabel={accessibilityLabel}
    isDisabled={isDisabled}
    onBlur={onBlur}
    onFocus={onFocus}
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
    onPress={onPress}
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
  </PrimitiveButton>
))

Button.displayName = 'Button'
Button.componentSymbol = Symbol('REVERT_BUTTON')

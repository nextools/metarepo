import { LayoutContext } from '@revert/layout'
import { useContext } from 'react'
import type { TComponent } from 'refun'
import { PrimitiveSize } from './PrimitiveSize'
import type { TSize } from './types'

export const Size: TComponent<TSize> = ({
  shouldPreventWrap,
  children,
}) => {
  const {
    _left,
    _top,
    _width,
    _height,
    _maxWidth,
    _onWidthChange,
    _onHeightChange,
  } = useContext(LayoutContext)

  return PrimitiveSize({
    left: _left,
    top: _top,
    width: _width,
    height: _height,
    maxWidth: _maxWidth,
    onWidthChange: _onWidthChange,
    onHeightChange: _onHeightChange,
    shouldPreventWrap,
    children,
  })
}

Size.displayName = 'Size'
Size.componentSymbol = Symbol('REVERT_SIZE')

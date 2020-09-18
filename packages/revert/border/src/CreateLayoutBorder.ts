import { LayoutContext } from '@revert/layout'
import type { FC } from 'react'
import { component, startWithType, mapContext } from 'refun'
import type { TBorder, TPrimitiveBorder } from './types'

export const CreateLayoutBorder = (PrimitiveBorder: FC<TPrimitiveBorder>) => {
  const Border = component(
    startWithType<TBorder>(),
    mapContext(LayoutContext)
  )(({
    _parentLeft,
    _parentTop,
    _parentWidth,
    _parentHeight,
    color,
    radius,
    overflow,
    borderLeftWidth,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderWidth,
  }) => PrimitiveBorder({
    color,
    radius,
    overflow,
    borderWidth,
    borderLeftWidth,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    left: _parentLeft,
    top: _parentTop,
    width: _parentWidth,
    height: _parentHeight,
  }))

  Border.displayName = 'Border'
  Border.componentSymbol = Symbol('REVERT_BORDER')

  return Border
}


import { LayoutContext } from '@revert/layout'
import type { FC } from 'react'
import { component, startWithType, mapContext } from 'refun'
import type { TPrimitiveShadow, TShadow } from './types'

export const CreateLayoutShadow = (PrimitiveShadow: FC<TPrimitiveShadow>) => {
  const Shadow = component(
    startWithType<TShadow>(),
    mapContext(LayoutContext)
  )(({
    _parentTop,
    _parentLeft,
    _parentWidth,
    _parentHeight,
    color,
    blurRadius,
    offsetX,
    offsetY,
    overflow,
    radius,
    spreadRadius,
  }) => PrimitiveShadow({
    left: _parentLeft,
    top: _parentTop,
    width: _parentWidth,
    height: _parentHeight,
    color,
    blurRadius,
    offsetX,
    offsetY,
    overflow,
    radius,
    spreadRadius,
  }))

  Shadow.displayName = 'Shadow'
  Shadow.componentSymbol = Symbol('REVERT_SHADOW')

  return Shadow
}

import { LayoutContext } from '@revert/layout'
import type { FC } from 'react'
import { startWithType, component, mapContext } from 'refun'
import type { TBackground, TPrimitiveBackground } from './types'

export const CreateLayoutBackground = (PrimitiveBackground: FC<TPrimitiveBackground>) => {
  const Background = component(
    startWithType<TBackground>(),
    mapContext(LayoutContext)
  )(({
    _parentLeft,
    _parentTop,
    _parentWidth,
    _parentHeight,
    color,
    overflow,
    radius,
  }) => PrimitiveBackground({
    left: _parentLeft,
    top: _parentTop,
    width: _parentWidth,
    height: _parentHeight,
    overflow,
    radius,
    color,
  }))

  Background.displayName = 'Background'
  Background.componentSymbol = Symbol('REVERT_BACKGROUND')

  return Background
}


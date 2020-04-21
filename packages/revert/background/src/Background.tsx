import React from 'react'
import { startWithType, component, mapContext } from 'refun'
import { AnimationColor } from '@revert/animation'
import { LayoutContext } from '@revert/layout'
import { PrimitiveBackground } from './PrimitiveBackground'
import { TBackground } from './types'

export const Background = component(
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
}) => (
  <AnimationColor toColor={color}>
    {(color) => (
      <PrimitiveBackground
        left={_parentLeft}
        top={_parentTop}
        width={_parentWidth}
        height={_parentHeight}
        overflow={overflow}
        radius={radius}
        color={color}
      />
    )}
  </AnimationColor>
))

Background.displayName = 'Background'
Background.componentSymbol = Symbol('REVERT_BACKGROUND')

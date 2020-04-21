import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { AnimationColor } from '@revert/animation'
import { LayoutContext } from '@revert/layout'
import { PrimitiveBorder } from './PrimitiveBorder'
import { TBorder } from './types'

export const Border = component(
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
}) => (
  <AnimationColor toColor={color}>
    {(color) => (
      <PrimitiveBorder
        color={color}
        radius={radius}
        overflow={overflow}
        borderWidth={borderWidth}
        borderLeftWidth={borderLeftWidth}
        borderTopWidth={borderTopWidth}
        borderRightWidth={borderRightWidth}
        borderBottomWidth={borderBottomWidth}
        left={_parentLeft}
        top={_parentTop}
        width={_parentWidth}
        height={_parentHeight}
      />
    )}
  </AnimationColor>
))

Border.displayName = 'Border'
Border.componentSymbol = Symbol('REVERT_BORDER')

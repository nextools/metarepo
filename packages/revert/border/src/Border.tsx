import { LayoutContext } from '@revert/layout'
import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { PrimitiveBorder } from './PrimitiveBorder'
import type { TBorder } from './types'

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
))

Border.displayName = 'Border'
Border.componentSymbol = Symbol('REVERT_BORDER')

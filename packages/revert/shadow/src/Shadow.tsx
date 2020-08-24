import { LayoutContext } from '@revert/layout'
import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { PrimitiveShadow } from './PrimitiveShadow'
import type { TShadow } from './types'

export const Shadow = component(
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
}) => (
  <PrimitiveShadow
    left={_parentLeft}
    top={_parentTop}
    width={_parentWidth}
    height={_parentHeight}
    color={color}
    blurRadius={blurRadius}
    offsetX={offsetX}
    offsetY={offsetY}
    overflow={overflow}
    radius={radius}
    spreadRadius={spreadRadius}
  />
))

Shadow.displayName = 'Shadow'
Shadow.componentSymbol = Symbol('REVERT_SHADOW')

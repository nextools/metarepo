import { PrimitiveShadow } from '@revert/shadow'
import type { TShadow } from '@revert/shadow'
import React from 'react'
import { component, startWithType } from 'refun'
import { AnimationColor } from '../animation'

export const Shadow = component(
  startWithType<TShadow>()
)(({
  color,
  radius,
  blurRadius,
  spreadRadius,
  offsetX,
  offsetY,
  overflow,
}) => (
  <AnimationColor toColor={color}>
    {(color) => (
      <PrimitiveShadow
        color={color}
        offsetX={offsetX}
        offsetY={offsetY}
        overflow={overflow}
        radius={radius}
        blurRadius={blurRadius}
        spreadRadius={spreadRadius}
      />
    )}
  </AnimationColor>
))

Shadow.displayName = 'Shadow'
Shadow.componentSymbol = Symbol('SHADOW')

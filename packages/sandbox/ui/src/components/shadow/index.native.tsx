import React from 'react'
import { Block } from '@primitives/block'
import { component, mapDefaultProps, startWithType } from 'refun'
import { colorToString, TColor } from 'colorido'
import { AnimationColor } from '../animation-color'

export type TShadow = {
  color: TColor,
  topLeftRadius?: number,
  topRightRadius?: number,
  bottomRightRadius?: number,
  bottomLeftRadius?: number,
  blurRadius?: number,
  spreadRadius?: number,
  offsetX?: number,
  offsetY?: number,
  overflow?: number,
}

export const Shadow = component(
  startWithType<TShadow>(),
  mapDefaultProps({
    topLeftRadius: 0,
    topRightRadius: 0,
    bottomRightRadius: 0,
    bottomLeftRadius: 0,
    offsetX: 0,
    offsetY: 0,
    blurRadius: 0,
    spreadRadius: 0,
    overflow: 0,
    borderWidth: 1,
  })
)(({
  topLeftRadius,
  topRightRadius,
  bottomRightRadius,
  bottomLeftRadius,
  borderWidth,
  color,
  overflow,
}) => (
  <AnimationColor values={color}>
    {(color) => (
      <Block
        shouldIgnorePointerEvents
        isFloating
        top={-overflow}
        right={-overflow}
        bottom={-overflow}
        left={-overflow}
        style={{
          borderTopLeftRadius: topLeftRadius,
          borderTopRightRadius: topRightRadius,
          borderBottomRightRadius: bottomRightRadius,
          borderBottomLeftRadius: bottomLeftRadius,
          borderColor: colorToString(color),
          borderWidth,
        }}
      />
    )}
  </AnimationColor>
))

Shadow.displayName = 'Shadow'

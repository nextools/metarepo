import React from 'react'
import { Block } from '@primitives/block'
import { component, mapDefaultProps, startWithType } from 'refun'
import { TColor, colorToString } from 'colorido'

export type TBorder = {
  color: TColor,
  topLeftRadius?: number,
  topRightRadius?: number,
  bottomRightRadius?: number,
  bottomLeftRadius?: number,
  topWidth?: number,
  rightWidth?: number,
  bottomWidth?: number,
  leftWidth?: number,
  overflow?: number,
}

export const Border = component(
  startWithType<TBorder>(),
  mapDefaultProps({
    topLeftRadius: 0,
    topRightRadius: 0,
    bottomRightRadius: 0,
    bottomLeftRadius: 0,
    topWidth: 0,
    rightWidth: 0,
    bottomWidth: 0,
    leftWidth: 0,
    overflow: 0,
  })
)(({
  topLeftRadius,
  topRightRadius,
  bottomRightRadius,
  bottomLeftRadius,
  topWidth,
  rightWidth,
  bottomWidth,
  leftWidth,
  color,
  overflow,
}) => (
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
      borderTopWidth: topWidth,
      borderRightWidth: rightWidth,
      borderBottomWidth: bottomWidth,
      borderLeftWidth: leftWidth,
    }}
  />
))

import React from 'react'
import { Block } from '@primitives/block'
import { component, mapDefaultProps, startWithType } from 'refun'
import { colorToString } from 'colorido'
import { TThemeableBorder } from '@themeables/border'

export type TBorder = TThemeableBorder

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
    overflowBottom: 0,
    overflowLeft: 0,
    overflowRight: 0,
    overflowTop: 0,
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
  overflowBottom,
  overflowLeft,
  overflowRight,
  overflowTop,
}) => (
  <Block
    shouldIgnorePointerEvents
    isFloating
    top={-overflowTop}
    right={-overflowRight}
    bottom={-overflowBottom}
    left={-overflowLeft}
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

Border.displayName = 'Border'

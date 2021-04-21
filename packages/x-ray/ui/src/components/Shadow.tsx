import { colorToString } from '@revert/color'
import type { TColor } from '@revert/color'
import { component, mapDefaultProps, startWithType } from 'refun'
import { Block } from './Block'

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
  })
)(({
  topLeftRadius,
  topRightRadius,
  bottomRightRadius,
  bottomLeftRadius,
  blurRadius,
  spreadRadius,
  offsetX,
  offsetY,
  color,
  overflow,
}) => (
  <Block
    shouldIgnorePointerEvents
    top={-overflow}
    right={-overflow}
    bottom={-overflow}
    left={-overflow}
    style={{
      borderTopLeftRadius: topLeftRadius,
      borderTopRightRadius: topRightRadius,
      borderBottomRightRadius: bottomRightRadius,
      borderBottomLeftRadius: bottomLeftRadius,
      boxShadow: `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${colorToString(color)}`,
    }}
  />
))

Shadow.displayName = 'Shadow'

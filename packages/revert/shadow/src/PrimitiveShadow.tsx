import { colorToString } from '@revert/color'
import type { CSSProperties } from 'react'
import { component, startWithType, mapProps } from 'refun'
import { isNumber } from 'tsfn'
import type { TPrimitiveShadow } from './types'

export const PrimitiveShadow = component(
  startWithType<TPrimitiveShadow>(),
  mapProps(({
    left = 0,
    top = 0,
    width,
    height,
    color = 0,
    radius,
    overflow = 0,
    blurRadius = 0,
    spreadRadius = 0,
    offsetX = 0,
    offsetY = 0,
  }) => {
    const style: CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      pointerEvents: 'none',
      left: left - overflow,
      top: top - overflow,
      right: -overflow,
      bottom: -overflow,
      borderRadius: radius,
      boxShadow: `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${colorToString(color)}`,
    }

    if (isNumber(width)) {
      style.width = width + overflow * 2
    }

    if (isNumber(height)) {
      style.height = height + overflow * 2
    }

    return {
      style,
    }
  })
)((props) => (
  <div {...props}/>
))

PrimitiveShadow.displayName = 'PrimitiveShadow'

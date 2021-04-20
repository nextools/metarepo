import { colorToString } from '@revert/color'
import type { HTMLProps, CSSProperties } from 'react'
import { component, startWithType, mapProps } from 'refun'
import { isNumber } from 'tsfn'
import type { TPrimitiveBorder } from './types'

export const PrimitiveBorder = component(
  startWithType<TPrimitiveBorder>(),
  mapProps(({
    color = 0,
    borderWidth = 0,
    borderLeftWidth,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    radius,
    overflow = 0,
    left = 0,
    top = 0,
    width,
    height,
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
      borderColor: colorToString(color),
      borderStyle: 'solid',
      borderTopWidth: borderWidth,
      borderLeftWidth: borderWidth,
      borderRightWidth: borderWidth,
      borderBottomWidth: borderWidth,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      borderBottomLeftRadius: radius,
      boxSizing: 'border-box',
    }

    if (isNumber(width)) {
      style.width = width + overflow * 2
    }

    if (isNumber(height)) {
      style.height = height + overflow * 2
    }

    if (isNumber(borderLeftWidth)) {
      style.borderLeftWidth = borderLeftWidth
    }

    if (isNumber(borderTopWidth)) {
      style.borderTopWidth = borderTopWidth
    }

    if (isNumber(borderRightWidth)) {
      style.borderRightWidth = borderRightWidth
    }

    if (isNumber(borderBottomWidth)) {
      style.borderBottomWidth = borderBottomWidth
    }

    const props: HTMLProps<HTMLDivElement> = {
      style,
    }

    return props
  })
)((props) => (
  <div {...props}/>
))

PrimitiveBorder.displayName = 'PrimitiveBorder'

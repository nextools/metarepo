import React, { HTMLProps } from 'react'
import { component, startWithType, mapProps } from 'refun'
import { normalizeStyle, TStyle } from 'stili'
import { isNumber } from 'tsfn'
import { colorToString } from '@revert/color'
import { TPrimitiveBorder } from './types'

export const PrimitiveBorder = component(
  startWithType<TPrimitiveBorder>(),
  mapProps(({
    color,
    borderWidth,
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
    const styles: TStyle = {
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
      styles.width = width + overflow * 2
    }

    if (isNumber(height)) {
      styles.height = height + overflow * 2
    }

    if (isNumber(borderLeftWidth)) {
      styles.borderLeftWidth = borderLeftWidth
    }

    if (isNumber(borderTopWidth)) {
      styles.borderTopWidth = borderTopWidth
    }

    if (isNumber(borderRightWidth)) {
      styles.borderRightWidth = borderRightWidth
    }

    if (isNumber(borderBottomWidth)) {
      styles.borderBottomWidth = borderBottomWidth
    }

    const props: HTMLProps<HTMLDivElement> = {
      style: normalizeStyle(styles),
    }

    return props
  })
)((props) => (
  <div {...props}/>
))

PrimitiveBorder.displayName = 'PrimitiveBorder'

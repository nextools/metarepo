import React, { HTMLProps } from 'react'
import { component, startWithType, mapProps } from 'refun'
import { normalizeStyle, TStyle } from 'stili'
import { colorToString } from '@revert/color'
import { isNumber } from 'tsfn'
import { TPrimitiveBackground } from './types'

export const PrimitiveBackground = component(
  startWithType<TPrimitiveBackground>(),
  mapProps(({
    color,
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
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      borderBottomLeftRadius: radius,
      backgroundColor: colorToString(color),
    }

    if (isNumber(width)) {
      styles.width = width + overflow * 2
    }

    if (isNumber(height)) {
      styles.height = height + overflow * 2
    }

    const props: HTMLProps<HTMLDivElement> = {
      style: normalizeStyle(styles),
    }

    return props
  })
)((props) => (
  <div {...props}/>
))

PrimitiveBackground.displayName = 'PrimitiveBackground'

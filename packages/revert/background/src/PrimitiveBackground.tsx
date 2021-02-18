import { colorToString } from '@revert/color'
import type { HTMLProps, CSSProperties } from 'react'
import { component, startWithType, mapProps } from 'refun'
import { isNumber } from 'tsfn'
import type { TPrimitiveBackground } from './types'

export const PrimitiveBackground = component(
  startWithType<TPrimitiveBackground>(),
  mapProps(({
    color = 0,
    radius,
    overflow = 0,
    left = 0,
    top = 0,
    width,
    height,
  }) => {
    const style: CSSProperties = {
      display: 'flex',
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
      style.width = width + overflow * 2
    }

    if (isNumber(height)) {
      style.height = height + overflow * 2
    }

    const props: HTMLProps<HTMLDivElement> = {
      style,
    }

    return props
  })
)((props) => (
  <div {...props}/>
))

PrimitiveBackground.displayName = 'PrimitiveBackground'

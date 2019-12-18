import React, { HTMLProps } from 'react'
import { component, startWithType, mapProps, mapDefaultProps } from 'refun'
import { normalizeStyle, TStyle } from 'stili'
import { isNumber } from 'tsfn'
import { colorToString } from '../../colors'
import { TPrimitiveBorder } from './types'

export * from './types'

export const PrimitiveBorder = component(
  startWithType<TPrimitiveBorder>(),
  mapDefaultProps({
    overflow: 0,
    width: 0,
  }),
  mapProps(({
    color,
    width,
    leftWidth,
    topWidth,
    rightWidth,
    bottomWidth,
    radius,
    overflow,
  }) => {
    const styles: TStyle = {
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      pointerEvents: 'none',
      left: -overflow,
      top: -overflow,
      right: -overflow,
      bottom: -overflow,
      borderColor: colorToString(color),
      borderStyle: 'solid',
      borderTopWidth: width,
      borderLeftWidth: width,
      borderRightWidth: width,
      borderBottomWidth: width,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      borderBottomLeftRadius: radius,
    }

    if (isNumber(leftWidth)) {
      styles.borderLeftWidth = leftWidth
    }

    if (isNumber(topWidth)) {
      styles.borderTopWidth = topWidth
    }

    if (isNumber(rightWidth)) {
      styles.borderRightWidth = rightWidth
    }

    if (isNumber(bottomWidth)) {
      styles.borderBottomWidth = bottomWidth
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

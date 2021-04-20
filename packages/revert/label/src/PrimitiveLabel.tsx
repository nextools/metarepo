import type { CSSProperties } from 'react'
import { component, startWithType, mapWithProps } from 'refun'
import type { TPrimitiveLabel } from './types'

export const PrimitiveLabel = component(
  startWithType<TPrimitiveLabel>(),
  mapWithProps(({
    left = 0,
    top = 0,
    width,
    height,
  }) => {
    const style: CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      left,
      top,
      width: width ?? '100%',
      height: height ?? '100%',
      userSelect: 'none',
    }

    return {
      style,
    }
  })
)(({ style, children }) => (
  <label style={style}>
    {children}
  </label>
))

PrimitiveLabel.displayName = 'PrimitiveLabel'

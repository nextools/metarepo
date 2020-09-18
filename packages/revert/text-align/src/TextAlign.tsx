import React from 'react'
import type { CSSProperties } from 'react'
import { component, mapWithPropsMemo, startWithType } from 'refun'
import type { TTextAlign } from './types'

export const TextAlign = component(
  startWithType<TTextAlign>(),
  mapWithPropsMemo(({ align }) => {
    const style: CSSProperties = {
      textAlign: align,
    }

    return {
      style,
    }
  }, ['align'])
)(({ style, children }) => (
  <div style={style}>
    {children}
  </div>
))

TextAlign.displayName = 'TextAlign'

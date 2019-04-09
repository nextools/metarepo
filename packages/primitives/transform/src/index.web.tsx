import React from 'react'
import { prefixStyle, TStyle } from '@lada/prefix'
import { component, startWithType, mapWithProps, mapDefaultProps } from 'refun'
import { TTransformProps } from './types'

export * from './types'

export const Transform = component(
  startWithType<TTransformProps>(),
  mapDefaultProps({
    shouldStretch: false,
    shouldUse3d: false,
  }),
  mapWithProps(({ x, y, rotate, scale, hOrigin, vOrigin, shouldUse3d, shouldStretch }) => {
    const styles: TStyle = {
      display: 'flex',
      position: 'relative',
      alignSelf: 'flex-start',
      /* flexbox hack */
      minWidth: 0,
    }

    let transform = ''
    let transformOrigin = ''

    if (typeof x !== 'undefined' || typeof y !== 'undefined') {
      transform += shouldUse3d
        ? `translate3d(${x || 0}px, ${y || 0}px, 0)`
        : `translate(${x || 0}px, ${y || 0}px)`
    }

    if (typeof scale !== 'undefined') {
      if (transform.length > 0) {
        transform += ' '
      }

      transform += shouldUse3d
        ? `scale3d(${scale}, ${scale}, 1)`
        : `scale(${scale}, ${scale})`
    }

    if (typeof rotate !== 'undefined') {
      if (transform.length > 0) {
        transform += ' '
      }

      transform += `rotate3d(0, 0, 1, ${rotate}deg)`
    }

    if (typeof hOrigin !== 'undefined' || typeof vOrigin !== 'undefined') {
      transformOrigin = `${hOrigin} ${vOrigin}`
    }

    if (transform.length > 0) {
      styles.transform = transform
    }

    if (transformOrigin.length > 0) {
      styles.transformOrigin = transformOrigin
    }

    if (shouldStretch) {
      styles.flexGrow = 1
      styles.alignSelf = 'stretch'
    }

    return {
      style: prefixStyle(styles),
    }
  })
)('Transform', ({ style, children }) => (
  <div style={style}>{children}</div>
))

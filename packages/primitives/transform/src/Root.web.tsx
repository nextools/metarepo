import React from 'react'
import { normalizeStyle, TStyle } from 'stili'
import { component, startWithType, mapWithProps, mapDefaultProps } from 'refun'
import { TTransformProps } from './types'

export const Transform = component(
  startWithType<TTransformProps>(),
  mapDefaultProps({
    shouldStretch: false,
    shouldUse3d: false,
  }),
  mapWithProps(({ x, y, rotate, scale, hOrigin, vOrigin, shouldUse3d, shouldStretch }) => {
    const style: TStyle = {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      flexGrow: 0,
      flexShrink: 0,
      alignSelf: 'flex-start',
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
      style.transform = transform
    }

    if (transformOrigin.length > 0) {
      style.transformOrigin = transformOrigin
    }

    if (shouldStretch) {
      style.flexGrow = 1
      style.flexShrink = 1
      style.alignSelf = 'stretch'
    }

    return {
      style: normalizeStyle(style),
    }
  })
)(({ style, children }) => (
  <div style={style}>{children}</div>
))

Transform.displayName = 'Transform'

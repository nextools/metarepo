import type { CSSProperties } from 'react'
import { component, startWithType, mapWithProps, mapContext } from 'refun'
import { isNumber } from 'tsfn'
import { TransformContext } from './TransformContext'
import type { TTransform } from './types'

export const PrimitiveTransform = component(
  startWithType<TTransform>(),
  mapContext(TransformContext),
  mapWithProps(({
    x = 0,
    y = 0,
    rotate,
    scale,
    hOrigin = 'center',
    vOrigin = 'center',
    shouldUse3d = false,
    _scale,
  }) => {
    const style: CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      flexGrow: 0,
      flexShrink: 0,
      alignSelf: 'flex-start',
      minWidth: 0,
      transformOrigin: `${hOrigin} ${vOrigin}`,
    }

    let contextScale = _scale

    let transform = shouldUse3d
      ? `translate3d(${x}px, ${y}px, 0)`
      : `translate(${x}px, ${y}px)`

    if (isNumber(scale)) {
      transform += shouldUse3d
        ? ` scale3d(${scale}, ${scale}, 1)`
        : ` scale(${scale}, ${scale})`
      contextScale *= scale
    }

    if (isNumber(rotate)) {
      transform += shouldUse3d
        ? ` rotate3d(0, 0, 1, ${rotate}deg)`
        : ` rotate(${rotate}deg)`
    }

    style.transform = transform

    return {
      contextScale,
      style,
    }
  })
)(({ contextScale, style, children }) => (
  <div style={style}>
    <TransformContext.Provider value={{ _scale: contextScale }}>
      {children}
    </TransformContext.Provider>
  </div>
))

PrimitiveTransform.displayName = 'PrimitiveTransform'

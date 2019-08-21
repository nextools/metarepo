import React from 'react'
import {
  component,
  mapState,
  onMount,
  startWithType,
  mapHandlers,
  mapWithProps,
  mapThrottledHandlerAnimationFrame,
} from 'refun'
import { normalizeStyle } from 'stili'
import { TRoot } from './types'

const globalObject = global as any as Window

export const Root = component(
  startWithType<TRoot>(),
  mapState('dimensions', 'setDimensions', () => ({
    width: globalObject.innerWidth,
    height: globalObject.innerHeight,
  }), []),
  mapHandlers({
    setDimensions: ({ setDimensions }) => () => setDimensions({
      width: globalObject.innerWidth,
      height: globalObject.innerHeight,
    }),
  }),
  mapThrottledHandlerAnimationFrame('setDimensions'),
  onMount(({ setDimensions }) => {
    globalObject.addEventListener('resize', setDimensions)

    return () => {
      globalObject.removeEventListener('resize', setDimensions)
    }
  }),
  mapWithProps(({ dimensions }) => ({
    style: normalizeStyle({
      display: 'flex',
      position: 'absolute',
      flexDirection: 'row',
      left: 0,
      top: 0,
      width: dimensions.width,
      height: dimensions.height,
    }),
  }))
)(({ children, dimensions, style }) => (
  <div style={style}>{children(dimensions)}</div>
))

Root.displayName = 'Root'

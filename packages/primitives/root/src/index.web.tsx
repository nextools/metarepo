import React from 'react'
import { TStyle } from '@lada/prefix'
import {
  component,
  mapState,
  onMount,
  startWithType,
  mapHandlers,
  mapWithProps,
  mapThrottledHandlerAnimationFrame,
} from 'refun'
import { TRoot } from './types'

export * from './types'

const globalObject = global as any as Window

const defaultStyle: TStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
}

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
    styles: {
      ...defaultStyle,
      width: dimensions.width,
      height: dimensions.height,
    },
  }))
)('Root', ({ children, dimensions, styles }) => (
  <div style={styles}>{children(dimensions)}</div>
))

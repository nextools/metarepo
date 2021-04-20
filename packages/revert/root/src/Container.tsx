import type { CSSProperties } from 'react'
import { component, startWithType, mapWithProps } from 'refun'
import type { TDimensions } from './types'

export type TContainer = {
  dimensions: TDimensions,
}

export const Container = component(
  startWithType<TContainer>(),
  mapWithProps(({ dimensions }) => {
    const style: CSSProperties = {
      display: 'flex',
      position: 'absolute',
      flexDirection: 'row',
      left: 0,
      top: 0,
      width: dimensions.width,
      height: dimensions.height,
    }

    return {
      style,
    }
  })
)(({ style, children }) => (
  <div style={style}>
    {children}
  </div>
))

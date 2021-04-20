import { PrimitiveTransform } from '@revert/transform'
import type { CSSProperties } from 'react'
import { component, mapRef, mapWithPropsMemo, startWithType } from 'refun'
import { UNDEFINED } from 'tsfn'
import { onLayout } from '../on-layout'
import { round } from './round'
import type { TDemoComponent } from './types'

export const DemoComponentMeasure = component(
  startWithType<TDemoComponent>(),
  mapWithPropsMemo(({ width }) => {
    const style: CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      width,
    }

    return {
      style,
    }
  }, ['width']),
  mapRef('ref', null as null | HTMLDivElement),
  onLayout(({ ref, height, onHeightChange }) => {
    if (ref.current === null) {
      return
    }

    const measuredHeight = round(ref.current.offsetHeight)

    if (height !== UNDEFINED && onHeightChange !== UNDEFINED && height !== measuredHeight) {
      onHeightChange(measuredHeight)
    }
  })
)(({
  left,
  top,
  ref,
  style,
  shouldUse3d,
  children,
}) => (
  <PrimitiveTransform x={left} y={top} hOrigin="left" vOrigin="top" shouldUse3d={shouldUse3d}>
    <div ref={ref} style={style}>
      {children}
    </div>
  </PrimitiveTransform>
))

DemoComponentMeasure.displayName = 'DemoComponentMeasure'

import { Size } from '@revert/size'
import { PrimitiveTransform } from '@revert/transform'
import type { FC } from 'react'
import React from 'react'
import type { TDemoComponent } from './types'

export const DemoComponentMeasure: FC<TDemoComponent> = ({
  left,
  top,
  width,
  height,
  onHeightChange,
  shouldUse3d,
  children,
}) => (
  <PrimitiveTransform x={left} y={top} hOrigin="left" vOrigin="top" shouldUse3d={shouldUse3d}>
    <Size
      width={width}
      height={height}
      onHeightChange={onHeightChange}
    >
      {children}
    </Size>
  </PrimitiveTransform>
)

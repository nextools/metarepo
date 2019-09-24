import React, { FC } from 'react'
import { Background as PrimitiveBackground } from '@primitives/background'
import { TColor } from 'colorido'
import { AnimationColor } from '../animation-color'

export type TBackground = {
  color: TColor,
  topLeftRadius?: number,
  topRightRadius?: number,
  bottomRightRadius?: number,
  bottomLeftRadius?: number,
}

export const Background: FC<TBackground> = ({ topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius, color }) => (
  <AnimationColor values={color}>
    {(color) => (
      <PrimitiveBackground
        color={color}
        topLeftRadius={topLeftRadius}
        topRightRadius={topRightRadius}
        bottomLeftRadius={bottomLeftRadius}
        bottomRightRadius={bottomRightRadius}
      />
    )}
  </AnimationColor>
)

Background.displayName = 'Background'

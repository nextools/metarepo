import React, { FC } from 'react'
import { Border as PrimitiveBorder, TBorder as TPrimitiveBorder } from '@primitives/border'
import { AnimationColor } from './AnimationColor'

export type TBorder = TPrimitiveBorder & {
  animationTime?: number,
}

export const Border: FC<TBorder> = ({ color, animationTime = 200, ...props }) => (
  <AnimationColor values={color} time={animationTime}>
    {(color) => (
      <PrimitiveBorder
        color={color}
        {...props}
      />
    )}
  </AnimationColor>
)

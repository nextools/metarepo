import { Border as PrimitiveBorder } from '@primitives/border'
import type { TBorder as TPrimitiveBorder } from '@primitives/border'
import React from 'react'
import type { FC } from 'react'
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

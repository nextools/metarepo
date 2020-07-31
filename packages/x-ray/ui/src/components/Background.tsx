import { Background as PrimitiveBackground } from '@primitives/background'
import type { TBackground as TPrimitiveBackground } from '@primitives/background'
import React from 'react'
import type { FC } from 'react'
import { AnimationColor } from './AnimationColor'

export type TBackground = TPrimitiveBackground & {
  animationTime?: number,
}

export const Background: FC<TBackground> = ({ color, animationTime = 200, ...props }) => (
  <AnimationColor values={color} time={animationTime}>
    {(color) => (
      <PrimitiveBackground
        color={color}
        {...props}
      />
    )}
  </AnimationColor>
)

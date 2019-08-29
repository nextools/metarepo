import React, { FC } from 'react'
import { Background as PrimitiveBackground, TBackground as TPrimitiveBackground } from '@primitives/background'
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

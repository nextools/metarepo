import { AnimationColor } from '@revert/animation'
import { PrimitiveBackground } from '@revert/background'
import type { TPrimitiveBackground } from '@revert/background'
import type { FC } from 'react'

export type TBackground = TPrimitiveBackground & {
  color: number,
  animationTime?: number,
}

export const Background: FC<TBackground> = ({ color, animationTime = 200, ...props }) => (
  <AnimationColor toColor={color} time={animationTime}>
    {(color) => (
      <PrimitiveBackground
        color={color}
        {...props}
      />
    )}
  </AnimationColor>
)

import { PrimitiveBackground } from '@revert/background'
import { component, startWithType } from 'refun'
import type { TPrimitiveLinearGradient } from './types'

export const PrimitiveLinearGradient = component(
  startWithType<TPrimitiveLinearGradient>()
)(({
  colors,
  top,
  left,
  width,
  height,
  overflow,
  radius,
}) => (
  <PrimitiveBackground
    color={colors[0][0]}
    top={top}
    left={left}
    width={width}
    height={height}
    overflow={overflow}
    radius={radius}
  />
))

PrimitiveLinearGradient.displayName = 'PrimitiveLinearGradient'

import { LayoutContext } from '@revert/layout'
import { startWithType, component, mapContext } from 'refun'
import { PrimitiveLinearGradient } from './PrimitiveLinearGradient'
import type { TLinearGradient } from './types'

export const LinearGradient = component(
  startWithType<TLinearGradient>(),
  mapContext(LayoutContext)
)(({
  _parentLeft,
  _parentTop,
  _parentWidth,
  _parentHeight,
  colors,
  overflow,
  radius,
  angle,
}) => (
  <PrimitiveLinearGradient
    left={_parentLeft}
    top={_parentTop}
    width={_parentWidth}
    height={_parentHeight}
    overflow={overflow}
    radius={radius}
    colors={colors}
    angle={angle}
  />
))

LinearGradient.displayName = 'LinearGradient'
LinearGradient.componentSymbol = Symbol('REVERT_LINEAR_GRADIENT')

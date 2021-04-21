import { AnimationColor } from '@revert/animation'
import {
  CreateLayoutBackground,
  PrimitiveBackground as RevertPrimitiveBackground,
} from '@revert/background'
import type { TPrimitiveBackground } from '@revert/background'
import { component, mapDefaultProps, startWithType } from 'refun'

export const PrimitiveBackground = component(
  startWithType<TPrimitiveBackground>(),
  mapDefaultProps({
    color: 0,
  })
)((props) => (
  <AnimationColor toColor={props.color}>
    {(color) => (
      <RevertPrimitiveBackground {...props} color={color}/>
    )}
  </AnimationColor>
))

PrimitiveBackground.displayName = RevertPrimitiveBackground.displayName

export const Background = CreateLayoutBackground(PrimitiveBackground)

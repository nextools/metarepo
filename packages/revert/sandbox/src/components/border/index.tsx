import { AnimationColor } from '@revert/animation'
import {
  CreateLayoutBorder,
  PrimitiveBorder as RevertPrimitiveBorder,
} from '@revert/border'
import type { TPrimitiveBorder } from '@revert/border'
import { component, mapDefaultProps, startWithType } from 'refun'

export const PrimitiveBorder = component(
  startWithType<TPrimitiveBorder>(),
  mapDefaultProps({
    color: 0,
  })
)((props) => (
  <AnimationColor toColor={props.color}>
    {(color) => (
      <RevertPrimitiveBorder {...props} color={color}/>
    )}
  </AnimationColor>
))

PrimitiveBorder.displayName = RevertPrimitiveBorder.displayName

export const Border = CreateLayoutBorder(PrimitiveBorder)

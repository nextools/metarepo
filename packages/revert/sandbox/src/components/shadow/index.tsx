import { AnimationColor } from '@revert/animation'
import {
  PrimitiveShadow as RevertPrimitiveShadow,
  Shadow as RevertShadow,
} from '@revert/shadow'
import type { TShadow } from '@revert/shadow'
import React from 'react'
import type { TComponent } from 'refun'

export const Shadow: TComponent<TShadow> = (props) => (
  <AnimationColor toColor={props.color}>
    {(color) => (
      <RevertPrimitiveShadow {...props} color={color}/>
    )}
  </AnimationColor>
)

Shadow.displayName = RevertShadow.displayName
Shadow.componentSymbol = RevertShadow.componentSymbol

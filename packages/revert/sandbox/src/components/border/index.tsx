import { AnimationColor } from '@revert/animation'
import {
  Border as RevertBorder,
  PrimitiveBorder as RevertPrimitiveBorder,
} from '@revert/border'
import type { TBorder, TPrimitiveBorder } from '@revert/border'
import React from 'react'
import type { TComponent } from 'refun'

export const PrimitiveBorder: TComponent<TPrimitiveBorder> = (props) => (
  <AnimationColor toColor={props.color}>
    {(color) => (
      <RevertPrimitiveBorder {...props} color={color}/>
    )}
  </AnimationColor>
)

PrimitiveBorder.displayName = RevertPrimitiveBorder.displayName

export const Border: TComponent<TBorder> = (props) => (
  <AnimationColor toColor={props.color}>
    {(color) => (
      <RevertBorder {...props} color={color}/>
    )}
  </AnimationColor>
)

Border.displayName = RevertBorder.displayName
Border.componentSymbol = RevertBorder.componentSymbol

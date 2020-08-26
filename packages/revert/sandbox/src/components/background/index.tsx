import { AnimationColor } from '@revert/animation'
import {
  Background as RevertBackground,
  PrimitiveBackground as RevertPrimitiveBackground,
} from '@revert/background'
import type { TBackground, TPrimitiveBackground } from '@revert/background'
import React from 'react'
import type { TComponent } from 'refun'

export const PrimitiveBackground: TComponent<TPrimitiveBackground> = (props) => (
  <AnimationColor toColor={props.color}>
    {(color) => (
      <RevertPrimitiveBackground {...props} color={color}/>
    )}
  </AnimationColor>
)

PrimitiveBackground.displayName = RevertPrimitiveBackground.displayName

export const Background: TComponent<TBackground> = (props) => (
  <AnimationColor toColor={props.color}>
    {(color) => (
      <RevertBackground {...props} color={color}/>
    )}
  </AnimationColor>
)

Background.displayName = RevertBackground.displayName
Background.componentSymbol = RevertBackground.componentSymbol

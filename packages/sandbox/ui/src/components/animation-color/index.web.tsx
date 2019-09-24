import React from 'react'
import { TAnimation, Animation, easeInOutCubic } from '@primitives/animation'
import { TOmitKey } from 'tsfn'
import { TColor } from 'colorido'
import { component, startWithType, mapWithProps } from 'refun'

export type TAnimationColor = TOmitKey<TAnimation<TColor>, 'easing' | 'time'>

export const AnimationColor = component(
  startWithType<TAnimationColor>(),
  mapWithProps(({ children }) => ({
    children: (values: TColor) => children([
      Math.round(values[0]),
      Math.round(values[1]),
      Math.round(values[2]),
      values[3],
    ]),
  }))
)(({ children, values }) => (
  <Animation easing={easeInOutCubic} time={150} values={values}>{children}</Animation>
))

AnimationColor.displayName = 'AnimationColor'

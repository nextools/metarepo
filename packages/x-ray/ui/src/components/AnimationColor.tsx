import { TAnimation, Animation, easeInOutCubic } from '@primitives/animation'
import { TColor } from 'colorido'
import React from 'react'
import { component, startWithType, mapWithProps } from 'refun'
import { TOmitKey } from 'tsfn'

export type TAnimationColor = TOmitKey<TAnimation<TColor>, 'easing'>

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
)(({ children, values, time, onAnimationEnd }) => (
  <Animation easing={easeInOutCubic} time={time} values={values} onAnimationEnd={onAnimationEnd}>{children}</Animation>
))

AnimationColor.displayName = 'AnimationColor'

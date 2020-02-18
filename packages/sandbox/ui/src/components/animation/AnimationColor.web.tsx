import React, { ReactElement } from 'react'
import { component, startWithType, mapDefaultProps, mapWithPropsMemo } from 'refun'
import { TColor } from '../../colors'
import { Animation } from './Animation'
import { isShallowEqualArray } from './is-shallow-equal-array'
import { easeColor } from './ease-color'
import { easeInOutCubic } from './easing'
import { TEasingFn } from './types'

export type TAnimationColor = {
  fromColor?: TColor,
  toColor: TColor,
  children: (color: TColor) => ReactElement | null,
  shouldNotAnimate?: boolean,
  time?: number,
  easing?: TEasingFn,
}

export const AnimationColor = component(
  startWithType<TAnimationColor>(),
  mapDefaultProps({
    time: 200,
    easing: easeInOutCubic,
  }),
  mapWithPropsMemo(({ easing }) => ({
    mapColor: easeColor(easing),
  }), ['easing'])
)(({ fromColor, toColor, time, children, mapColor, shouldNotAnimate }) => (
  <Animation
    time={time}
    from={fromColor}
    to={toColor}
    shouldNotAnimate={shouldNotAnimate}
    valuesEqualFn={isShallowEqualArray}
    animationMapFn={mapColor}
  >
    {children}
  </Animation>
))

AnimationColor.displayName = 'AnimationColor'

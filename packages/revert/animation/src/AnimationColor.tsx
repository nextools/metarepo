import React, { ReactElement } from 'react'
import { component, startWithType, mapDefaultProps, mapWithPropsMemo } from 'refun'
import { TColor } from '@revert/color'
import { Animation } from './Animation'
import { easeColor } from './ease-color'
import { easeInOutCubic } from './easing'
import { TEasingFn } from './types'
import { isValueEqual } from './is-value-equal'

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
    valuesEqualFn={isValueEqual}
    animationMapFn={mapColor}
  >
    {children}
  </Animation>
))

AnimationColor.displayName = 'AnimationColor'

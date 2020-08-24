import React from 'react'
import type { ReactElement } from 'react'
import { component, startWithType, mapDefaultProps, mapWithPropsMemo } from 'refun'
import { Animation } from './Animation'
import { easeValue } from './ease-value'
import { easeInOutCubic } from './easing'
import { isValueEqual } from './is-value-equal'
import type { TEasingFn } from './types'

export type TAnimationValue = {
  fromValue?: number,
  toValue: number,
  children: (value: number) => ReactElement | null,
  shouldNotAnimate?: boolean,
  time?: number,
  easing?: TEasingFn,
}

export const AnimationValue = component(
  startWithType<TAnimationValue>(),
  mapDefaultProps({
    time: 200,
    easing: easeInOutCubic,
  }),
  mapWithPropsMemo(({ easing }) => ({
    mapValue: easeValue(easing),
  }), ['easing'])
)(({ fromValue, toValue, time, children, mapValue, shouldNotAnimate }) => (
  <Animation
    time={time}
    from={fromValue}
    to={toValue}
    shouldNotAnimate={shouldNotAnimate}
    valuesEqualFn={isValueEqual}
    animationMapFn={mapValue}
  >
    {children}
  </Animation>
))

AnimationValue.displayName = 'AnimationValue'

import React, { ReactElement } from 'react'
import { component, startWithType, mapDefaultProps, mapWithPropsMemo } from 'refun'
import { Animation } from './Animation'
import { easeInOutCubic } from './easing'
import { TEasingFn } from './types'
import { isValueEqual } from './is-value-equal'
import { easeValue } from './ease-value'

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

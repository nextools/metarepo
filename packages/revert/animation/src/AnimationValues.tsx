import { component, startWithType, mapDefaultProps, mapWithPropsMemo } from 'refun'
import { Animation } from './Animation'
import { easeArray } from './ease-array'
import { easeInOutCubic } from './easing'
import { isShallowEqualArray } from './is-shallow-equal-array'
import type { TAnimationValues } from './types'

export const AnimationValues = component(
  startWithType<TAnimationValues>(),
  mapDefaultProps({
    time: 200,
    easing: easeInOutCubic,
  }),
  mapWithPropsMemo(({ easing }) => ({
    mapValue: easeArray(easing),
  }), ['easing'])
)(({ fromValues, toValues, time, children, mapValue, shouldNotAnimate, onAnimationEnd }) => (
  <Animation
    time={time}
    from={fromValues}
    to={toValues}
    shouldNotAnimate={shouldNotAnimate}
    valuesEqualFn={isShallowEqualArray}
    animationMapFn={mapValue}
    onAnimationEnd={onAnimationEnd}
  >
    {children}
  </Animation>
))

AnimationValues.displayName = 'AnimationValues'

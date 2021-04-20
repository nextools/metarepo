import { component, startWithType, mapDefaultProps, mapWithPropsMemo } from 'refun'
import { Animation } from './Animation'
import { easeValue } from './ease-value'
import { easeInOutCubic } from './easing'
import { isValueEqual } from './is-value-equal'
import type { TAnimationValue } from './types'

export const AnimationValue = component(
  startWithType<TAnimationValue>(),
  mapDefaultProps({
    time: 200,
    easing: easeInOutCubic,
  }),
  mapWithPropsMemo(({ easing }) => ({
    mapValue: easeValue(easing),
  }), ['easing'])
)(({ fromValue, toValue, time, children, mapValue, shouldNotAnimate, onAnimationEnd }) => (
  <Animation
    time={time}
    from={fromValue}
    to={toValue}
    shouldNotAnimate={shouldNotAnimate}
    valuesEqualFn={isValueEqual}
    animationMapFn={mapValue}
    onAnimationEnd={onAnimationEnd}
  >
    {children}
  </Animation>
))

AnimationValue.displayName = 'AnimationValue'

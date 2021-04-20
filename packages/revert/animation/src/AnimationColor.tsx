import { component, startWithType, mapDefaultProps, mapWithPropsMemo } from 'refun'
import { Animation } from './Animation'
import { easeColor } from './ease-color'
import { easeInOutCubic } from './easing'
import { isValueEqual } from './is-value-equal'
import type { TAnimationColor } from './types'

export const AnimationColor = component(
  startWithType<TAnimationColor>(),
  mapDefaultProps({
    time: 200,
    easing: easeInOutCubic,
  }),
  mapWithPropsMemo(({ easing }) => ({
    mapColor: easeColor(easing),
  }), ['easing'])
)(({ fromColor, toColor, time, children, mapColor, shouldNotAnimate, onAnimationEnd }) => (
  <Animation
    time={time}
    from={fromColor}
    to={toColor}
    shouldNotAnimate={shouldNotAnimate}
    valuesEqualFn={isValueEqual}
    animationMapFn={mapColor}
    onAnimationEnd={onAnimationEnd}
  >
    {children}
  </Animation>
))

AnimationColor.displayName = 'AnimationColor'

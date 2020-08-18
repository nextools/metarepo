import type { TColor } from '@revert/color'
import type { ReactElement } from 'react'

export type TAnimationMapFn <T> = (from: T, to: T, time: number) => T

export type TEasingFn = (range: number, time: number) => number

export type TAnimation<T> = {
  time: number,
  from?: T,
  to: T,
  children: (value: T) => ReactElement | null,
  valuesEqualFn: (a: T, b: T) => boolean,
  animationMapFn: TAnimationMapFn<T>,
  shouldNotAnimate?: boolean,
  onAnimationEnd?: () => void,
}

export type TAnimationColor = {
  fromColor?: TColor,
  toColor: TColor,
  children: (color: TColor) => ReactElement | null,
  shouldNotAnimate?: boolean,
  time?: number,
  easing?: TEasingFn,
}

export type TAnimationValue = {
  fromValue?: number,
  toValue: number,
  children: (value: number) => ReactElement | null,
  shouldNotAnimate?: boolean,
  time?: number,
  easing?: TEasingFn,
}

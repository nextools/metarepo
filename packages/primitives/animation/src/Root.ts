import { useRef, useEffect, useState, ReactElement } from 'react'
import { isUndefined, isFunction } from 'tsfn'
import { TEasingFn } from './types'

export type TAnimation<T> = {
  time: number,
  values: T,
  children: (args: T) => ReactElement,
  easing: TEasingFn,
  shouldNotAnimate?: boolean,
  onAnimationEnd?: () => void,
}

const REFRESH_RATE = 1000 / 60
const THRESHOLD = 1 - 0.001

const isShallowEqualArray = (a: any[], b: any[]): boolean => {
  if (a === b) {
    return true
  }

  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

export const Animation = <T extends number[]>({ time, children, values, easing, shouldNotAnimate, onAnimationEnd }: TAnimation<T>) => {
  const rafId = useRef<any>()
  const [state, setState] = useState(0)
  const stateRef = useRef(state)
  const shouldNotAnimateRef = useRef(shouldNotAnimate)
  const loopRef = useRef<() => void>()
  const valuesRef = useRef(values)
  const fromValuesRef = useRef(values)
  const resultRef = useRef(values)

  stateRef.current = state
  shouldNotAnimateRef.current = shouldNotAnimate

  if (isUndefined(loopRef.current)) {
    const loop = () => {
      const nextState = shouldNotAnimateRef.current
        ? 1
        : stateRef.current + REFRESH_RATE / time

      if (nextState > THRESHOLD) {
        setState(1)

        if (isFunction(onAnimationEnd)) {
          onAnimationEnd()
        }
      } else {
        setState(nextState)
        rafId.current = requestAnimationFrame(loop)
      }
    }

    loopRef.current = loop
  }

  if (!isShallowEqualArray(values, valuesRef.current)) {
    fromValuesRef.current = resultRef.current

    stateRef.current = REFRESH_RATE / time
    cancelAnimationFrame(rafId.current)

    if (!isUndefined(loopRef.current)) {
      loopRef.current()
    }
  }

  valuesRef.current = values

  useEffect(() => () => {
    cancelAnimationFrame(rafId.current)
  }, [])

  const fromValues = fromValuesRef.current
  const currentState = stateRef.current
  const result = values.map((to, i) => easing(fromValues[i], to - fromValues[i], currentState)) as T

  resultRef.current = result

  return children(result)
}

Animation.displayName = 'Animation'

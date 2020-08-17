import { useRef, useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { isDefined, EMPTY_ARRAY, NOOP } from 'tsfn'
import type { TAnimationMapFn } from './types'

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

const REFRESH_RATE = 1000 / 60
const THRESHOLD = 1 - 0.001

export const Animation = <T extends any>({
  time,
  from,
  to,
  children,
  animationMapFn,
  valuesEqualFn,
  shouldNotAnimate,
  onAnimationEnd,
}: TAnimation<T>) => {
  const rafId = useRef<any>()
  const [state, setState] = useState(0)
  const stateRef = useRef(state)
  const shouldNotAnimateRef = useRef(shouldNotAnimate)
  const loopRef = useRef<() => void>(NOOP)
  const onMountRef = useRef<() => void>(NOOP)
  const prevToArgRef = useRef<T>(to)
  const prevFromArgRef = useRef<T>()
  const fromRef = useRef<T>(to)
  const resultRef = useRef<T>(to)

  stateRef.current = state
  shouldNotAnimateRef.current = shouldNotAnimate

  if (loopRef.current === NOOP) {
    const loop = () => {
      const nextState = shouldNotAnimateRef.current
        ? 1
        : stateRef.current + REFRESH_RATE / time

      if (nextState > THRESHOLD) {
        setState(1)
        onAnimationEnd?.()
      } else {
        setState(nextState)
        rafId.current = requestAnimationFrame(loop)
      }
    }

    loopRef.current = loop
  }

  if (onMountRef.current === NOOP) {
    onMountRef.current = () => () => {
      cancelAnimationFrame(rafId.current)
    }
  }

  let fromValueChanged = false

  if (isDefined(from) && isDefined(prevFromArgRef.current) && !valuesEqualFn(from, prevFromArgRef.current)) {
    prevFromArgRef.current = from
    fromRef.current = from
    resultRef.current = from
    stateRef.current = 0
    fromValueChanged = true
  }

  let toValueChanged = false

  if (!valuesEqualFn(to, prevToArgRef.current)) {
    prevToArgRef.current = to
    fromRef.current = resultRef.current
    stateRef.current = 0
    toValueChanged = true
  }

  if ((fromValueChanged || toValueChanged) && !valuesEqualFn(fromRef.current, to)) {
    cancelAnimationFrame(rafId.current)
    loopRef.current()
  }

  useEffect(onMountRef.current, EMPTY_ARRAY)

  const result = animationMapFn(fromRef.current, to, state)

  resultRef.current = result

  return children(result)
}

Animation.displayName = 'Animation'

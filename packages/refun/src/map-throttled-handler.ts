import { useRef, useEffect } from 'react'
import { requestAnimationFrame, cancelAnimationFrame, UNDEFINED, EMPTY_ARRAY, isFunction } from 'tsfn'

export const mapThrottledHandlerFactory = (setFn: Function, clearFn: Function) =>
  <P extends {}> (handlerName: keyof P, ...setFnArgs: any[]) =>
    (props: P): P => {
      const timerId = useRef<any>(null)
      const throttledHandlerRef = useRef<(...args: any[]) => void>()
      const onUnmountRef = useRef<() => () => void>()
      const currentPropsHandlerRef = useRef<P[keyof P]>()
      const handlerArgsRef = useRef<any[]>(EMPTY_ARRAY)

      currentPropsHandlerRef.current = props[handlerName]

      if (throttledHandlerRef.current === UNDEFINED) {
        const timeoutCallback = () => {
          timerId.current = null

          if (isFunction(currentPropsHandlerRef.current)) {
            currentPropsHandlerRef.current(...handlerArgsRef.current)
          }
        }

        throttledHandlerRef.current = (...args: any[]) => {
          handlerArgsRef.current = args

          if (timerId.current === null && isFunction(currentPropsHandlerRef.current)) {
            timerId.current = setFn(timeoutCallback, ...setFnArgs)
          }
        }

        onUnmountRef.current = () => () => {
          if (timerId.current !== null) {
            clearFn(timerId.current)

            timerId.current = null
          }
        }
      }

      useEffect(onUnmountRef.current!, EMPTY_ARRAY)

      return {
        ...props,
        [handlerName]: throttledHandlerRef.current,
      }
    }

export const mapThrottledHandlerTimeout = mapThrottledHandlerFactory(setTimeout, clearTimeout)
export const mapThrottledHandlerAnimationFrame = mapThrottledHandlerFactory(requestAnimationFrame, cancelAnimationFrame)

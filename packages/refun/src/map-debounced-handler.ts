import { useRef, useEffect } from 'react'
import { isFunction, UNDEFINED, EMPTY_ARRAY } from 'tsfn'

export const mapDebouncedHandlerFactory = (setFn: Function, clearFn: Function) =>
  <P extends {}> (handlerName: keyof P, ...setFnArgs: any[]) =>
    (props: P): P => {
      const timerId = useRef<number | null>(null)
      const debouncedHandlerRef = useRef<(...args: any[]) => void>()
      const onUnmountRef = useRef<() => () => void>()
      const currentPropsHandlerRef = useRef<P[keyof P]>()
      const handlerArgsRef = useRef<any[]>(EMPTY_ARRAY)

      currentPropsHandlerRef.current = props[handlerName]

      if (debouncedHandlerRef.current === UNDEFINED) {
        const timeoutCallback = () => {
          timerId.current = null

          if (isFunction(currentPropsHandlerRef.current)) {
            currentPropsHandlerRef.current(...handlerArgsRef.current)
          }
        }

        debouncedHandlerRef.current = (...args: any[]) => {
          if (timerId.current !== null) {
            clearFn(timerId.current)

            timerId.current = null
          }

          handlerArgsRef.current = EMPTY_ARRAY

          if (isFunction(currentPropsHandlerRef.current)) {
            handlerArgsRef.current = args
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
        [handlerName]: debouncedHandlerRef.current,
      }
    }

export const mapDebouncedHandlerTimeout = mapDebouncedHandlerFactory(setTimeout, clearTimeout)

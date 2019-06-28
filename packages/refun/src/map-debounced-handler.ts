import { useRef } from 'react'
import { isFunction, UNDEFINED } from 'tsfn'
import { useEffectFn } from './utils'

export const mapDebouncedHandlerFactory = (setFn: Function, clearFn: Function) =>
  <P extends {}> (handlerName: keyof P, ...setFnArgs: any[]) =>
    (props: P): P => {
      const timerId = useRef<number>()
      const debouncedHandler = useRef<((...args: any[]) => void)>()
      const originalHandler = useRef<P[keyof P]>()

      if (originalHandler.current !== props[handlerName] || originalHandler === UNDEFINED) {
        originalHandler.current = props[handlerName]
        debouncedHandler.current = (...args: any[]) => {
          if (timerId.current !== UNDEFINED) {
            clearFn(timerId.current)
          }

          timerId.current = setFn(() => {
            if (isFunction(originalHandler.current)) {
              originalHandler.current(...args)
            }

            timerId.current = UNDEFINED
          }, ...setFnArgs)
        }
      }

      useEffectFn(() => () => {
        if (timerId.current !== UNDEFINED) {
          clearFn(timerId.current)
        }

        timerId.current = UNDEFINED
      }, [])

      return {
        ...props,
        [handlerName]: debouncedHandler.current,
      }
    }

export const mapDebouncedHandlerTimeout = mapDebouncedHandlerFactory(setTimeout, clearTimeout)

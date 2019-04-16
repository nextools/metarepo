import { useRef } from 'react'
import { requestAnimationFrame, cancelAnimationFrame, UNDEFINED } from 'tsfn'
import { useEffectFn } from './utils'

export const mapThrottledHandlerFactory = (setFn: Function, clearFn: Function) =>
  <P extends {}> (handlerName: keyof P, ...setFnArgs: any[]) =>
    (props: P): P => {
      const timerId = useRef<number>()
      const throttledHandler = useRef<(...args: any[]) => void>()
      const originalHandler = useRef<P[keyof P]>()
      const args = useRef<any[]>([])

      if (originalHandler.current !== props[handlerName] || originalHandler === UNDEFINED) {
        originalHandler.current = props[handlerName]
        throttledHandler.current = (...newArgs: any[]) => {
          args.current = newArgs

          if (timerId.current === UNDEFINED) {
            timerId.current = setFn(() => {
              if (typeof originalHandler.current === 'function') {
                originalHandler.current(...args.current)
              }

              timerId.current = UNDEFINED
            }, ...setFnArgs)
          }
        }
      }

      useEffectFn(() => () => {
        if (timerId.current !== UNDEFINED) {
          clearFn(timerId.current)

          timerId.current = UNDEFINED
        }
      }, [])

      return {
        ...props,
        [handlerName]: throttledHandler.current,
      }
    }

export const mapThrottledHandlerTimeout = mapThrottledHandlerFactory(setTimeout, clearTimeout)
export const mapThrottledHandlerAnimationFrame = mapThrottledHandlerFactory(requestAnimationFrame, cancelAnimationFrame)

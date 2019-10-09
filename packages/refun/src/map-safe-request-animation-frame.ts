import { useRef, useEffect } from 'react'
import { TExtend, requestAnimationFrame, cancelAnimationFrame, UNDEFINED, EMPTY_ARRAY, EMPTY_OBJECT, NOOP } from 'tsfn'

export type TSafeRequestAnimationFrame = (cb: () => void) => () => void

export const mapSafeRequestAnimationFrameFactory = (requestAnimationFrameFn: Function, cancelAnimationFrameFn: Function) =>
  <P extends {}, K extends string>(propName: K) =>
    (props: P): TExtend<P, { [k in K]: TSafeRequestAnimationFrame }> => {
      const timerIdsRef = useRef<Set<any>>(EMPTY_OBJECT)
      const setSafeRafRef = useRef<TSafeRequestAnimationFrame>()
      const useEffectFnRef = useRef<() => () => void>()

      if (setSafeRafRef.current === UNDEFINED) {
        timerIdsRef.current = new Set()

        setSafeRafRef.current = ((cb) => {
          // check if component has been unmounted
          if (timerIdsRef.current === EMPTY_OBJECT) {
            return NOOP
          }

          const timerId = requestAnimationFrameFn(() => {
            timerIdsRef.current.delete(timerId)
            cb()
          })

          timerIdsRef.current.add(timerId)

          return () => {
            cancelAnimationFrameFn(timerId)
            timerIdsRef.current.delete(timerId)
          }
        }) as TSafeRequestAnimationFrame

        useEffectFnRef.current = () => () => {
          timerIdsRef.current.forEach((id) => cancelAnimationFrameFn(id))
          timerIdsRef.current.clear()
          // indicates that component has been unmounted
          timerIdsRef.current = EMPTY_OBJECT
        }
      }

      useEffect(useEffectFnRef.current!, EMPTY_ARRAY)

      // FIXME https://github.com/microsoft/TypeScript/issues/13948
      return {
        ...props,
        [propName]: setSafeRafRef.current,
      } as any
    }

export const mapSafeRequestAnimationFrame = mapSafeRequestAnimationFrameFactory(requestAnimationFrame, cancelAnimationFrame)

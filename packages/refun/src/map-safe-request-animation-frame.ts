import { useRef } from 'react'
import { TExtend, requestAnimationFrame, cancelAnimationFrame, UNDEFINED, EMPTY_ARRAY } from 'tsfn'
import { useEffectFn } from './utils'

export type TSafeRequestAnimationFrame = (cb: () => void) => () => void

export const mapSafeRequestAnimationFrameFactory = (requestAnimationFrameFn: Function, cancelAnimationFrameFn: Function) =>
  <P extends {}, K extends string>(propName: K) =>
    (props: P): TExtend<P, { [k in K]: TSafeRequestAnimationFrame }> => {
      const firstCall = useRef(true)
      const timerIds = useRef<Set<number>>(UNDEFINED as any)
      const setSafeRAF = useRef<TSafeRequestAnimationFrame>(UNDEFINED as any)
      const unmountFn = useRef<() => void>(UNDEFINED as any)

      if (firstCall.current) {
        firstCall.current = false

        timerIds.current = new Set()
        setSafeRAF.current = ((cb) => {
          const timerId = requestAnimationFrameFn(() => {
            timerIds.current.delete(timerId)
            cb()
          })

          timerIds.current.add(timerId)

          return () => {
            cancelAnimationFrameFn(timerId)
            timerIds.current.delete(timerId)
          }
        }) as TSafeRequestAnimationFrame

        unmountFn.current = () => () => {
          timerIds.current.forEach((id) => cancelAnimationFrameFn(id))
          timerIds.current.clear()
        }
      }

      useEffectFn(unmountFn.current, EMPTY_ARRAY)

      // FIXME https://github.com/microsoft/TypeScript/issues/13948
      // @ts-ignore
      return {
        ...props,
        [propName]: setSafeRAF.current,
      }
    }

export const mapSafeRequestAnimationFrame = mapSafeRequestAnimationFrameFactory(requestAnimationFrame, cancelAnimationFrame)

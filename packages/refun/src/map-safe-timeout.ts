import { useRef } from 'react'
import { TExtend } from 'tsfn'
import { useEffectFn } from './utils'

export type TSetSafeTimeout = (cb: () => void, delay: number) => () => void

export const mapSafeTimeoutFactory = (setTimeoutFn: Function, clearTimeoutFn: Function) =>
  <P extends {}, K extends string>(propName: K) =>
    (props: P): TExtend<P, { [k in K]: TSetSafeTimeout }> => {
      const timerIds = useRef<Set<number>>(new Set())
      const setSafeTimeout = useRef<TSetSafeTimeout>((cb, delay) => {
        const timerId = setTimeoutFn(() => {
          timerIds.current.delete(timerId)
          cb()
        }, delay)

        timerIds.current.add(timerId)

        return () => {
          clearTimeoutFn(timerId)
          timerIds.current.delete(timerId)
        }
      })

      useEffectFn(() => () => {
        timerIds.current.forEach((id) => clearTimeoutFn(id))
        timerIds.current.clear()
      }, [])

      // FIXME https://github.com/microsoft/TypeScript/issues/13948
      // @ts-ignore
      return {
        ...props,
        [propName]: setSafeTimeout.current,
      }
    }

export const mapSafeTimeout = mapSafeTimeoutFactory(setTimeout, clearTimeout)

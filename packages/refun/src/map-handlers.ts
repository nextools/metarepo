import { useRef } from 'react'
import { getObjectKeys, isUndefined, TExtend } from 'tsfn'

export type TActualHandlers <T> = {
  [key in keyof T]: (...args: any[]) => void
}

export type THandlers <P> = {
  [key: string]: (props: P) => (...args: any[]) => void,
}

export const mapHandlers = <P extends {}, R extends THandlers<P>> (handlers: R) => (props: P): TExtend<P, TActualHandlers<R>> => {
  const actualHandlers = useRef<TActualHandlers<R>>()
  const propsRef = useRef<P>(props)
  propsRef.current = props

  if (isUndefined(actualHandlers.current)) {
    actualHandlers.current = getObjectKeys(handlers).reduce((result, key) => {
      result[key] = (...args) => handlers[key](propsRef.current)(...args)

      return result
    }, {} as TActualHandlers<R>)
  }

  return {
    ...props,
    ...actualHandlers.current,
  }
}

export const mapHandlersFactory = <P extends {}, R extends THandlers<P>> (getHandlers: (props: P) => R) => (props: P): TExtend<P, TActualHandlers<R>> => {
  const actualHandlers = useRef<TActualHandlers<R>>()
  const propsRef = useRef<P>(props)
  propsRef.current = props

  if (isUndefined(actualHandlers.current)) {
    const handlers = getHandlers(props)
    actualHandlers.current = getObjectKeys(handlers).reduce((result, key) => {
      result[key] = (...args) => handlers[key](propsRef.current)(...args)

      return result
    }, {} as TActualHandlers<R>)
  }

  return {
    ...props,
    ...actualHandlers.current,
  }
}

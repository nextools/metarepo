import { useRef } from 'react'
import { getObjectKeys, TExtend, EMPTY_OBJECT } from 'tsfn'

export type TActualHandlers <T> = {
  [key in keyof T]: (...args: any[]) => void
}

export type THandlers <P> = {
  [key: string]: (props: P) => (...args: any[]) => void,
}

export const mapHandlers = <P extends {}, R extends THandlers<P>> (handlers: R) =>
  (props: P): TExtend<P, TActualHandlers<R>> => {
    const actualHandlers = useRef<TActualHandlers<R>>(EMPTY_OBJECT)
    const propsRef = useRef<P>(props)

    propsRef.current = props

    if (actualHandlers.current === EMPTY_OBJECT) {
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

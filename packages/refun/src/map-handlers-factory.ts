import { useRef } from 'react'
import { getObjectKeys, TExtend, EMPTY_OBJECT } from 'tsfn'
import { THandlers, TActualHandlers } from './map-handlers'

export const mapHandlersFactory = <P extends {}, R extends THandlers<P>> (getHandlers: (props: P) => R) =>
  (props: P): TExtend<P, TActualHandlers<R>> => {
    const actualHandlers = useRef<TActualHandlers<R>>(EMPTY_OBJECT)
    const propsRef = useRef<P>(props)

    propsRef.current = props

    if (actualHandlers.current === EMPTY_OBJECT) {
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

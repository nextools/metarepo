import { useState, useRef } from 'react'
import { TExtend, EMPTY_OBJECT } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const mapWithAsyncProps = <P extends {}, R extends {}>(mapper: (props: P) => Promise<R>, watchPropKeys: (keyof P)[]) =>
  (props: P): TExtend<P, Partial<R>> => {
    const [result, setResult] = useState<R>()
    const prevPropsRef = useRef<P>(EMPTY_OBJECT)
    const isLoadingRef = useRef(false)

    if (prevPropsRef.current === EMPTY_OBJECT || !shallowEqualByKeys(prevPropsRef.current, props, watchPropKeys)) {
      isLoadingRef.current = true
      prevPropsRef.current = props

      mapper(props)
        .then((result) => {
          isLoadingRef.current = false

          if (result !== null) {
            setResult(result)
          }
        })
        .catch((e) => {
          throw new Error(e)
        })
    }

    if (isLoadingRef.current) {
      return props
    }

    return {
      ...props,
      ...result,
    }
  }

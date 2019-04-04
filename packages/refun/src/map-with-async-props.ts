import { useState, useRef } from 'react'
import { TExtend, EMPTY_OBJECT } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const mapWithAsyncProps = <P extends {}, R extends {}> (mapper: (props: P) => Promise<R>, watchPropKeys: (keyof P)[]) =>
  (props: P): TExtend<P, Partial<R>> => {
    const [result, setResult] = useState<R>()
    const prevProps = useRef<P>(EMPTY_OBJECT)
    const isLoading = useRef(false)

    if (!shallowEqualByKeys(prevProps.current, props, watchPropKeys)) {
      isLoading.current = true
      prevProps.current = props

      mapper(props).then((result) => {
        isLoading.current = false

        if (result !== null) {
          setResult(result)
        }
      })
    }

    if (isLoading.current) {
      return props
    }

    return {
      ...props,
      ...result,
    }
  }
